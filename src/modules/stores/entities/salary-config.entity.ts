import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PaymentType } from './employee-contract.entity';

// CHU KỲ THANH TOÁN (KHI NÀO TRẢ LƯƠNG)
// Khác với Contract.PaymentType (CÁCH TÍNH lương: Ca/Giờ/Ngày/Tuần/Tháng)
export enum PaymentCycle {
  DAILY = 'Mỗi ngày',
  WEEKLY = 'Mỗi tuần',
  BIWEEKLY = '2 tuần',
  MONTHLY = 'Mỗi tháng',
}

export enum ApplicableEmployees {
  ALL = 'Toàn bộ nhân viên',
  SPECIFIC = 'Cụ thể',
}

export enum ConfigStatus {
  ACTIVE = 'Đang áp dụng',
  PAUSED = 'Tạm dừng',
}

// Config cho mỗi ngày
export interface DailyConfig {
  timesheetCloseTime: string; // Giờ chốt công (VD: "23:00")
  paymentTime: string; // Giờ chi trả (VD: "09:00")
  lockTime: string; // Giờ khóa lương (VD: "08:00")
}

// Config cho mỗi tuần / 2 tuần
export interface WeeklyConfig {
  timesheetCloseDay: number; // Ngày chốt công (2-8, 2=T2, 8=CN)
  timesheetCloseTime: string; // Giờ chốt công
  paymentDay: number; // Ngày chi trả (2-8)
  paymentTime: string; // Giờ chi trả (Mới thêm từ UI)
  lockDay: number; // Ngày khóa lương (2-8)
}

// Config cho mỗi tháng
export interface MonthlyConfig {
  timesheetCloseDate: number; // Ngày chốt công mỗi tháng (1-31)
  timesheetCloseTime: string; // Giờ chốt công
  paymentDate: number; // Ngày chi trả mỗi tháng (1-31)
  paymentTime: string; // Giờ chi trả (Mới thêm từ UI)
  lockDate: number; // Ngày khóa lương (1-31)
}

@Entity('salary_configs')
export class SalaryConfig extends BaseEntity {
  @Column({ name: 'owner_account_id' })
  ownerAccountId: string; // Chủ sở hữu tạo config này

  @Column({ type: 'jsonb' })
  storeIds: string[]; // Mảng các storeId áp dụng

  @Column({
    name: 'payment_cycle',
    type: 'enum',
    enum: PaymentCycle,
  })
  paymentCycle: PaymentCycle; // Chu kỳ thanh toán (KHI NÀO trả lương)
  
  // NOTE: paymentCycle KHÁC với Contract.paymentType:
  // - Contract.paymentType = "Ca/Giờ/Ngày/Tuần/Tháng" → CÁCH TÍNH lương
  // - SalaryConfig.paymentCycle = "Mỗi ngày/tuần/tháng" → KHI NÀO TRẢ lương
  //
  // VÍ DỤ: Nhân viên tính lương "Theo giờ" nhưng trả "Mỗi tuần"
  
  @Column({
    name: 'applicable_payment_type',
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.MONTH,
  })
  applicablePaymentType: PaymentType; // Hình thức tính lương áp dụng (Ca, Giờ, Ngày, Tuần, Tháng)

  @Column({
    name: 'applicable_employees',
    type: 'enum',
    enum: ApplicableEmployees,
  })
  applicableEmployees: ApplicableEmployees; // Áp dụng cho ai

  @Column({ name: 'employee_profile_ids', type: 'jsonb', nullable: true })
  employeeProfileIds: string[]; // Nếu chọn "Cụ thể", lưu danh sách ID

  @Column({ type: 'jsonb', nullable: true })
  dailyConfig: DailyConfig; // Config cho mỗi ngày

  @Column({ type: 'jsonb', nullable: true })
  weeklyConfig: WeeklyConfig; // Config cho mỗi tuần / 2 tuần

  @Column({ type: 'jsonb', nullable: true })
  monthlyConfig: MonthlyConfig; // Config cho mỗi tháng

  @Column({
    type: 'enum',
    enum: ConfigStatus,
    default: ConfigStatus.ACTIVE,
  })
  status: ConfigStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
