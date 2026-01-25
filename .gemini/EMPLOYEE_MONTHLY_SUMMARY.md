# Employee Monthly Summary Feature

## 📋 Tổng quan

Đã tạo hệ thống **Employee Monthly Summary** để lưu trữ và quản lý thống kê tháng của từng nhân viên, bao gồm:

- Số ca làm việc, đi trễ, về sớm, nghỉ phép...
- Lương tạm tính (base salary + allowances + bonuses - penalties)
- Tự động tạo khi thêm nhân viên mới
- Tự động tạo cho tất cả nhân viên vào đầu mỗi tháng (Cron Job)

---

## 🗄️ Entity: `EmployeeMonthlySummary`

**File**: `src/modules/stores/entities/employee-monthly-summary.entity.ts`

### Cấu trúc bảng:

```typescript
@Entity('employee_monthly_summaries')
@Unique(['employeeProfileId', 'month'])
export class EmployeeMonthlySummary extends BaseEntity {
  employeeProfileId: string;
  month: Date; // Ngày đầu tháng (VD: 2026-01-01)

  // Thống kê chấm công
  totalShifts: number; // Đã đăng ký
  completedShifts: number; // Đã làm thực tế
  onTimeArrivalsCount: number; // Đúng giờ
  lateArrivalsCount: number;
  earlyDeparturesCount: number;
  forgotClockOutCount: number;
  unauthorizedLeavesCount: number;
  authorizedLeavesCount: number;
  extraShiftsCount: number;

  // Lương
  baseSalary: number;
  allowances: number;
  bonuses: number;
  penalties: number;
  overtimePay: number;
  estimatedSalary: number;

  // Trạng thái
  isFinalized: boolean;
  finalizedAt: Date;
  notes: string;
}
```

### Unique Constraint:

- Mỗi nhân viên chỉ có **1 bản ghi duy nhất** cho mỗi tháng
- Constraint: `['employeeProfileId', 'month']`

---

## 🔄 Luồng tự động

### 1. **Tạo nhân viên thủ công** (`POST /stores/employees/manual`)

Khi tạo nhân viên mới, hệ thống tự động:

1. Tạo `Account`
2. Tạo `EmployeeProfile`
3. Tạo `EmployeeContract`
4. **Tạo `EmployeeMonthlySummary` cho tháng hiện tại** ✅

```typescript
// Trong stores.service.ts -> createManualEmployee()
await this.createOrUpdateMonthlySummary(
  savedProfile.id,
  data.contract?.salaryAmount || 0,
);
```

### 2. **Cron Job - Đầu mỗi tháng**

**File**: `src/modules/stores/stores-cron.service.ts`

**Lịch chạy**: `15 0 1 * *` (00:15 AM ngày 1 hàng tháng)

```typescript
@Cron('15 0 1 * *', {
  name: 'create-monthly-employee-summaries',
  timeZone: 'Asia/Ho_Chi_Minh',
})
async handleCreateMonthlySummaries() {
  const summaries = await this.storesService.createMonthlySummariesForAllEmployees();
  this.logger.log(`Successfully created ${summaries.length} monthly employee summaries`);
}
```

**Logic**:

- Lấy tất cả nhân viên có `employmentStatus = ACTIVE`
- Với mỗi nhân viên:
  - Lấy hợp đồng mới nhất để xác định `baseSalary`
  - Tạo `EmployeeMonthlySummary` cho tháng mới
  - Nếu đã tồn tại → bỏ qua (do Unique constraint)

---

### 2. Lấy danh sách nhân viên kèm thống kê tổng hợp

- **Endpoint**: `GET /stores/:id/employees`
- **Mô tả**: Trả về danh sách nhân viên kèm thông tin thống kê tháng hiện tại của từng người và thống kê tổng hợp toàn cửa hàng.
- **Response**: `EmployeesWithStatisticsResponseDto`
  - `employees`: Array `EmployeeProfileResponseDto` (kèm `totalShifts`, `completedShifts`, `onTimeArrivalsCount`, etc.)
  - `summary`: Object `EmployeeStatisticsSummaryDto`
    - `onTimeCount`: Tổng đúng giờ toàn cửa hàng
    - `authorizedLeaveCount`: Tổng nghỉ có phép
    - `lateArrivalCount`: Tổng đi trễ
    - `unauthorizedLeaveCount`: Tổng nghỉ không phép

### 3. Lấy thống kê tháng của nhân viên (Chi tiết)

```http
GET /stores/:id/employees/monthly-summaries?month=2026-01-01
```

**Query Parameters**:

- `month` (optional): Tháng cần lấy (YYYY-MM-DD), mặc định là tháng hiện tại

**Response**: `EmployeeMonthlySummaryResponseDto[]`

```json
[
  {
    "id": "summary_id",
    "employeeProfileId": "profile_id",
    "month": "2026-01-01",
    "totalShifts": 22,
    "lateArrivalsCount": 2,
    "earlyDeparturesCount": 1,
    "forgotClockOutCount": 0,
    "unauthorizedLeavesCount": 0,
    "authorizedLeavesCount": 1,
    "extraShiftsCount": 3,
    "baseSalary": 10000000,
    "allowances": 500000,
    "bonuses": 1000000,
    "penalties": 200000,
    "overtimePay": 500000,
    "estimatedSalary": 11800000,
    "isFinalized": false,
    "finalizedAt": null,
    "notes": null,
    "createdAt": "2026-01-01T00:15:00Z",
    "updatedAt": "2026-01-23T09:30:00Z"
  }
]
```

---

## 🛠️ Service Methods

### `createOrUpdateMonthlySummary()`

```typescript
async createOrUpdateMonthlySummary(
  employeeProfileId: string,
  baseSalary: number = 0,
  month?: Date,
)
```

**Chức năng**:

- Tạo hoặc lấy `EmployeeMonthlySummary` cho nhân viên và tháng cụ thể
- Nếu đã tồn tại → trả về bản ghi hiện tại
- Nếu chưa → tạo mới với `baseSalary` và `estimatedSalary = baseSalary`

### `createMonthlySummariesForAllEmployees()`

```typescript
async createMonthlySummariesForAllEmployees(date?: Date)
```

**Chức năng**:

- Tạo `EmployeeMonthlySummary` cho **tất cả nhân viên ACTIVE**
- Được gọi bởi Cron Job vào đầu mỗi tháng
- Lấy `baseSalary` từ hợp đồng mới nhất của nhân viên

### `getEmployeeMonthlySummaries()`

```typescript
async getEmployeeMonthlySummaries(storeId: string, monthStr?: string)
```

**Chức năng**:

- Lấy danh sách thống kê tháng của tất cả nhân viên trong cửa hàng
- Có thể filter theo tháng cụ thể

---

## 📊 Cách cập nhật thống kê

Hiện tại các trường thống kê (`totalShifts`, `lateArrivalsCount`, ...) được khởi tạo với giá trị `0`.

### Để cập nhật realtime, bạn cần:

1. **Khi nhân viên hoàn thành ca làm việc**:

```typescript
await this.monthlySummaryRepository.increment(
  { employeeProfileId, month: currentMonth },
  'totalShifts',
  1,
);
```

2. **Khi phát hiện đi trễ** (từ `DailyEmployeeReport`):

```typescript
await this.monthlySummaryRepository.increment(
  { employeeProfileId, month: currentMonth },
  'lateArrivalsCount',
  1,
);
```

3. **Tính lại lương tạm tính**:

```typescript
const summary = await this.monthlySummaryRepository.findOne({
  where: { employeeProfileId, month: currentMonth },
});

summary.estimatedSalary =
  summary.baseSalary +
  summary.allowances +
  summary.bonuses +
  summary.overtimePay -
  summary.penalties;

await this.monthlySummaryRepository.save(summary);
```

---

- [x] Tạo Entity `EmployeeMonthlySummary`
- [x] Đăng ký Entity trong `StoresModule`
- [x] Inject Repository vào `StoresService`
- [x] Thêm các trường `completedShifts`, `onTimeArrivalsCount`
- [x] Tạo method `createOrUpdateMonthlySummary()`
- [x] Tích hợp vào `createManualEmployee()` → Tự động tạo khi thêm nhân viên
- [x] Tạo Cron Job `handleCreateMonthlySummaries()` → Tự động tạo đầu mỗi tháng
- [x] Tạo method `createMonthlySummariesForAllEmployees()`
- [x] Tạo DTO `EmployeeMonthlySummaryResponseDto`, `EmployeesWithStatisticsResponseDto`
- [x] Cập nhật API `GET /stores/:id/employees` để trả về kèm thống kê
- [x] Tạo API endpoint `GET /stores/:id/employees/monthly-summaries`
- [x] Tạo method `getEmployeeMonthlySummaries()`

---

## 🚀 Bước tiếp theo

1. **Tích hợp cập nhật thống kê realtime**:
   - Khi chấm công → Tăng `totalShifts`
   - Khi phát hiện vi phạm → Tăng `lateArrivalsCount`, `earlyDeparturesCount`...
   - Khi tính lương → Cập nhật `penalties`, `bonuses`, `estimatedSalary`

2. **Chốt lương cuối tháng**:
   - Tạo API `POST /stores/:id/employees/:employeeId/monthly-summaries/:summaryId/finalize`
   - Set `isFinalized = true` và `finalizedAt = now()`
   - Sau khi chốt → Không cho phép sửa đổi

3. **Báo cáo và xuất Excel**:
   - API xuất báo cáo lương tháng
   - Dashboard thống kê tổng quan

---

## 📝 Notes

- Bảng này được thiết kế để **tối ưu hiệu suất** khi query thống kê
- Không cần JOIN nhiều bảng → Tất cả thông tin đã được tổng hợp sẵn
- Unique constraint đảm bảo không bị duplicate data
- Cron Job chạy sau khi tạo `MonthlyPayroll` (00:10 AM) để đảm bảo thứ tự
