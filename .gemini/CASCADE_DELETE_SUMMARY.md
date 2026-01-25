# CASCADE DELETE Configuration - Summary

## ✅ Đã fix tất cả entities thiếu CASCADE DELETE

### 📋 Chiến lược CASCADE:

1. **CASCADE DELETE** - Xóa bản ghi con khi xóa cha:
   - Dùng khi bản ghi con **KHÔNG CÓ Ý NGHĨA** nếu thiếu cha
   - VD: `EmployeeProfile` → `EmployeeContract`, `EmployeeMonthlySummary`

2. **SET NULL** - Đặt NULL khi xóa cha:
   - Dùng khi bản ghi con **VẪN CÓ GIÁ TRỊ** ngay cả khi thiếu cha
   - VD: `Order` → `Employee` (giữ lịch sử order ngay cả khi nhân viên nghỉ việc)

---

## 🔧 Các thay đổi đã thực hiện:

### 1. **Account Module**

#### `AccountRefreshToken`

```typescript
@ManyToOne(() => Account, { onDelete: 'CASCADE' })
account: Account;
```

✅ Xóa account → Xóa tất cả refresh tokens

#### `AccountOtp`

```typescript
@ManyToOne(() => Account, { onDelete: 'CASCADE' })
account: Account;
```

✅ Xóa account → Xóa tất cả OTP codes

---

### 2. **Store Module**

#### `Store`

```typescript
@ManyToOne(() => Account, { onDelete: 'CASCADE' })
owner: Account;
```

✅ Xóa owner account → Xóa tất cả stores của owner

---

### 3. **Employee Profile**

#### `EmployeeProfile`

```typescript
@ManyToOne(() => Account, { onDelete: 'CASCADE' })
account: Account;

@ManyToOne(() => StoreEmployeeType, { onDelete: 'SET NULL' })
employeeType: StoreEmployeeType;

@ManyToOne(() => StoreRole, { onDelete: 'SET NULL' })
storeRole: StoreRole;

@ManyToOne(() => WorkShift, { onDelete: 'SET NULL' })
workShift: WorkShift;
```

✅ Xóa account → Xóa employee profile
✅ Xóa employee type/role/shift → Đặt NULL (giữ profile)

---

### 4. **Employee Profile Role**

#### `EmployeeProfileRole`

```typescript
@ManyToOne(() => Account, { onDelete: 'SET NULL' })
assignedByAccount: Account;
```

✅ Xóa account người gán → Đặt NULL (giữ lịch sử)

---

### 5. **Notification**

#### `Notification`

```typescript
@ManyToOne(() => Account, { onDelete: 'CASCADE' })
account: Account;
```

✅ Xóa account → Xóa tất cả notifications

---

### 6. **Order Management**

#### `Order`

```typescript
@ManyToOne(() => EmployeeProfile, { onDelete: 'SET NULL' })
employee: EmployeeProfile;
```

✅ Xóa nhân viên → Đặt NULL (giữ lịch sử order)

#### `OrderItem`

```typescript
@ManyToOne(() => ServiceItem, { onDelete: 'SET NULL' })
serviceItem: ServiceItem;
```

✅ Xóa service item → Đặt NULL (giữ lịch sử, có itemSnapshot)

---

### 7. **Service Item**

#### `ServiceItemRecipe`

```typescript
@ManyToOne(() => Product, { onDelete: 'CASCADE' })
product: Product;
```

✅ Xóa product → Xóa recipe (không thể làm món nếu thiếu nguyên liệu)

---

### 8. **Shift Management**

#### `ShiftSlot`

```typescript
@ManyToOne(() => WorkShift, { onDelete: 'CASCADE' })
workShift: WorkShift;
```

✅ Xóa work shift → Xóa tất cả shift slots

#### `ShiftAssignment`

```typescript
@ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
employee: EmployeeProfile;
```

✅ Xóa nhân viên → Xóa tất cả shift assignments

---

### 9. **Asset Management**

#### `Asset`

```typescript
@ManyToOne(() => AssetUnit, { onDelete: 'SET NULL' })
assetUnit: AssetUnit;

@ManyToOne(() => AssetCategory, { onDelete: 'SET NULL' })
assetCategory: AssetCategory;

@ManyToOne(() => AssetStatus, { onDelete: 'SET NULL' })
assetStatus: AssetStatus;
```

✅ Xóa unit/category/status → Đặt NULL (giữ asset)

---

### 10. **Product Management**

#### `Product`

```typescript
@ManyToOne(() => ProductUnit, { onDelete: 'SET NULL' })
productUnit: ProductUnit;

@ManyToOne(() => ProductCategory, { onDelete: 'SET NULL' })
productCategory: ProductCategory;

@ManyToOne(() => ProductStatus, { onDelete: 'SET NULL' })
productStatus: ProductStatus;
```

✅ Xóa unit/category/status → Đặt NULL (giữ product)

---

## 📊 Các entities ĐÃ CÓ CASCADE từ trước:

✅ `DailyEmployeeReport` → `Store` (CASCADE)
✅ `EmployeeSalary` → `EmployeeProfile` (CASCADE)
✅ `EmployeeSalary` → `MonthlyPayroll` (CASCADE)
✅ `KpiType` → `Store` (CASCADE)
✅ `EmployeeProfile` → `Store` (CASCADE)
✅ `KpiAssignment` → `Store`, `EmployeeProfile`, `Kpi`, `KpiType`, `KpiPeriod` (CASCADE)
✅ `AssetStatus` → `Store` (CASCADE)
✅ `EmployeeProfileRole` → `EmployeeProfile`, `StoreRole` (CASCADE)
✅ `EmployeeContract` → `EmployeeProfile` (CASCADE)
✅ `StoreEmployeeType` → `Store` (CASCADE)
✅ `ProductCategory` → `Store` (CASCADE)
✅ `StoreEvent` → `Store` (CASCADE)
✅ `ServiceCategory` → `Store` (CASCADE)
✅ `ServiceItem` → `Store`, `ServiceCategory` (CASCADE)
✅ `ServiceItemRecipe` → `ServiceItem` (CASCADE)
✅ `Order` → `Store` (CASCADE)
✅ `OrderItem` → `Order` (CASCADE)
✅ `EmployeeMonthlySummary` → `EmployeeProfile` (CASCADE)
✅ `ProductStatus` → `Store` (CASCADE)
✅ `AssetUnit` → `Store` (CASCADE)
✅ `StoreRole` → `Store` (CASCADE)
✅ `ProductUnit` → `Store` (CASCADE)
✅ `MonthlyPayroll` → `Store` (CASCADE)
✅ `WorkCycle` → `Store` (CASCADE)
✅ `ShiftSlot` → `WorkCycle` (CASCADE)
✅ `ShiftAssignment` → `ShiftSlot` (CASCADE)
✅ `ShiftSwap` → `ShiftAssignment` (CASCADE)
✅ `WorkShift` → `Store` (CASCADE)

---

## 🎯 Kết quả:

### Khi xóa **Account**:

- ✅ Xóa tất cả `AccountRefreshToken`
- ✅ Xóa tất cả `AccountOtp`
- ✅ Xóa tất cả `Notification`
- ✅ Xóa tất cả `Store` (của owner)
- ✅ Xóa tất cả `EmployeeProfile` (và cascade xuống contracts, summaries...)

### Khi xóa **Store**:

- ✅ Xóa tất cả `EmployeeProfile` → cascade xuống:
  - `EmployeeContract`
  - `EmployeeMonthlySummary`
  - `EmployeeSalary`
  - `KpiAssignment`
  - `ShiftAssignment`
- ✅ Xóa tất cả `Asset`, `Product`, `ServiceItem`, `Order`
- ✅ Xóa tất cả `WorkShift`, `WorkCycle`, `ShiftSlot`
- ✅ Xóa tất cả `StoreRole`, `StoreEmployeeType`
- ✅ Xóa tất cả `MonthlyPayroll`, `DailyEmployeeReport`

### Khi xóa **EmployeeProfile**:

- ✅ Xóa tất cả `EmployeeContract`
- ✅ Xóa tất cả `EmployeeMonthlySummary`
- ✅ Xóa tất cả `EmployeeSalary`
- ✅ Xóa tất cả `ShiftAssignment`
- ✅ `Order.employee` → SET NULL (giữ lịch sử)

### Khi xóa **StoreRole** hoặc **StoreEmployeeType**:

- ✅ `EmployeeProfile` → SET NULL (giữ profile, chỉ mất role/type)

---

## ⚠️ Lưu ý quan trọng:

1. **Database Constraints**: Các thay đổi này chỉ có hiệu lực khi:
   - Chạy migration để cập nhật database constraints
   - Hoặc drop & recreate database

2. **Testing**: Nên test kỹ các trường hợp:
   - Xóa account owner
   - Xóa store
   - Xóa employee
   - Xóa categories/units/statuses

3. **Backup**: Luôn backup database trước khi chạy migration

---

## 🚀 Next Steps:

1. **Tạo migration** để sync với database:

```bash
yarn typeorm migration:generate -n AddCascadeDelete
yarn typeorm migration:run
```

2. **Test CASCADE behavior** trong development environment

3. **Review business logic** để đảm bảo CASCADE phù hợp với yêu cầu nghiệp vụ
