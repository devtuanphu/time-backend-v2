# Test Employee Monthly Summary API

## 1. Lấy thống kê tháng hiện tại cho tất cả nhân viên trong store

```bash
curl -X GET "http://localhost:3000/stores/{store_id}/employees/monthly-summaries" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## 2. Lấy thống kê tháng 1/2026

```bash
curl -X GET "http://localhost:3000/stores/{store_id}/employees/monthly-summaries?month=2026-01-01" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## 3. Lấy danh sách nhân viên kèm thống kê tháng hiện tại (Mới)

Đây là API chính để hiển thị danh sách nhân viên kèm theo Dashboard thống kê tổng quan.

```bash
curl -X GET "http://localhost:3000/stores/{store_id}/employees" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### Chi tiết nhân viên (GET /stores/:id/employees)

```json
{
  "employees": [
    {
      "id": "uuid-profile-1",
      "code": "NV001",
      "status": "active",
      "account": { "fullName": "Nguyễn Văn A" },
      "totalShifts": 22,
      "completedShifts": 20,
      "onTimeArrivalsCount": 18,
      "lateArrivalsCount": 2,
      "earlyDeparturesCount": 0,
      "authorizedLeavesCount": 1,
      "unauthorizedLeavesCount": 0,
      "estimatedSalary": 10000000
    }
  ],
  "summary": {
    "onTimeCount": 150,
    "authorizedLeaveCount": 5,
    "lateArrivalCount": 12,
    "unauthorizedLeaveCount": 2
  }
}
```

## 4. Kiểm tra Cron Job đã tạo summaries chưa

Nếu bạn muốn test Cron Job ngay lập tức (không chờ đến đầu tháng), có thể:

### Option 1: Gọi trực tiếp method (trong code)

```typescript
// Trong một controller test hoặc script
await this.storesService.createMonthlySummariesForAllEmployees();
```

### Option 2: Tạo API endpoint tạm để test

Thêm vào `stores.controller.ts`:

```typescript
@Post('admin/create-monthly-summaries')
@ApiOperation({ summary: '[ADMIN] Tạo monthly summaries cho tất cả nhân viên' })
async triggerMonthlySummaries() {
  return this.storesService.createMonthlySummariesForAllEmployees();
}
```

Sau đó gọi:

```bash
curl -X POST "http://localhost:3000/stores/admin/create-monthly-summaries" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## 5. Kiểm tra trong Database

```sql
-- Xem tất cả monthly summaries
SELECT * FROM employee_monthly_summaries ORDER BY created_at DESC;

-- Xem summaries của tháng hiện tại
SELECT
  ems.*,
  ep.code as employee_code,
  a.full_name
FROM employee_monthly_summaries ems
JOIN employee_profiles ep ON ems.employee_profile_id = ep.id
JOIN accounts a ON ep.account_id = a.id
WHERE ems.month = '2026-01-01'
ORDER BY a.full_name;

-- Đếm số summaries đã tạo
SELECT
  month,
  COUNT(*) as total_employees
FROM employee_monthly_summaries
GROUP BY month
ORDER BY month DESC;
```

## 6. Test tạo nhân viên mới

Khi tạo nhân viên mới bằng `POST /stores/employees/manual`, hệ thống sẽ tự động tạo monthly summary.

Sau khi tạo nhân viên, kiểm tra:

```sql
SELECT * FROM employee_monthly_summaries
WHERE employee_profile_id = 'NEW_EMPLOYEE_ID'
AND month = DATE_TRUNC('month', CURRENT_DATE);
```

Hoặc gọi API:

```bash
curl -X GET "http://localhost:3000/stores/{store_id}/employees/monthly-summaries" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 7. Cron Schedule

Cron Job sẽ tự động chạy:

- **Thời gian**: 00:15 AM (12:15 sáng) ngày 1 hàng tháng
- **Timezone**: Asia/Ho_Chi_Minh
- **Cron Expression**: `15 0 1 * *`

Để xem log:

```bash
# Trong terminal đang chạy yarn start:dev
# Sẽ thấy log:
# [StoresCronService] Starting monthly employee summaries creation for all active employees...
# [StoresCronService] Successfully created X monthly employee summaries
```
