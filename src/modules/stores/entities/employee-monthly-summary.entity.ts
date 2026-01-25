import { Entity, Column, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { EmployeePerformance } from './employee-performance.entity';

@Entity('employee_monthly_summaries')
@Unique(['employeeProfileId', 'month'])
export class EmployeeMonthlySummary extends BaseEntity {
  @Column({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({ name: 'month', type: 'date', comment: 'Ngày đầu tháng, VD: 2026-01-01' })
  month: Date;

  // Thống kê chấm công
  @Column({ name: 'total_shifts', type: 'int', default: 0, comment: 'Tổng số ca đã đăng ký' })
  totalShifts: number;

  @Column({ name: 'completed_shifts', type: 'int', default: 0, comment: 'Tổng số ca đã làm thực tế' })
  completedShifts: number;

  @Column({ name: 'on_time_arrivals_count', type: 'int', default: 0, comment: 'Số lần đi làm đúng giờ' })
  onTimeArrivalsCount: number;

  @Column({ name: 'late_arrivals_count', type: 'int', default: 0, comment: 'Số lần đi trễ' })
  lateArrivalsCount: number;

  @Column({ name: 'early_departures_count', type: 'int', default: 0, comment: 'Số lần về sớm' })
  earlyDeparturesCount: number;

  @Column({ name: 'forgot_clock_out_count', type: 'int', default: 0, comment: 'Số lần quên chấm công ra' })
  forgotClockOutCount: number;

  @Column({ name: 'unauthorized_leaves_count', type: 'int', default: 0, comment: 'Số lần nghỉ không phép' })
  unauthorizedLeavesCount: number;

  @Column({ name: 'authorized_leaves_count', type: 'int', default: 0, comment: 'Số lần nghỉ có phép' })
  authorizedLeavesCount: number;

  @Column({ name: 'extra_shifts_count', type: 'int', default: 0, comment: 'Số ca làm thêm' })
  extraShiftsCount: number;

  // Lương tạm tính
  @Column({
    name: 'base_salary',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Lương cơ bản từ hợp đồng',
  })
  baseSalary: number;

  @Column({
    name: 'allowances',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Phụ cấp',
  })
  allowances: number;

  @Column({
    name: 'bonuses',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Thưởng',
  })
  bonuses: number;

  @Column({
    name: 'penalties',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Phạt (đi trễ, về sớm...)',
  })
  penalties: number;

  @Column({
    name: 'overtime_pay',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Tiền làm thêm giờ',
  })
  overtimePay: number;

  @Column({
    name: 'estimated_salary',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Lương tạm tính = base + allowances + bonuses + overtime - penalties',
  })
  estimatedSalary: number;

  // Hiệu suất & Giờ làm (Tháng này)
  @Column({ name: 'performance_score', type: 'int', default: 0, comment: 'Điểm hiệu suất (0-100)' })
  performanceScore: number;

  @Column({ name: 'monthly_work_hours', type: 'decimal', precision: 6, scale: 2, default: 0, comment: 'Tổng giờ làm thực tế trong tháng' })
  monthlyWorkHours: number;

  // KPI (Tháng này)
  @Column({ name: 'kpi_total_count', type: 'int', default: 0, comment: 'Tổng số KPI giao trong tháng' })
  kpiTotalCount: number;

  @Column({ name: 'kpi_completed_count', type: 'int', default: 0, comment: 'Số lượng KPI hoàn thành' })
  kpiCompletedCount: number;

  // Chỉ số tích lũy (Snapshots tính đến cuối tháng này)
  @Column({ name: 'tenure_months', type: 'int', default: 0, comment: 'Số tháng làm việc tại store' })
  tenureMonths: number;

  @Column({ name: 'total_work_hours', type: 'decimal', precision: 10, scale: 2, default: 0, comment: 'Tổng giờ làm tích lũy' })
  totalWorkHours: number;

  @Column({ name: 'total_completed_shifts', type: 'int', default: 0, comment: 'Tổng ca làm tích lũy' })
  totalCompletedShifts: number;

  @Column({ name: 'is_finalized', default: false, comment: 'Đã chốt lương chưa' })
  isFinalized: boolean;

  @Column({ name: 'finalized_at', type: 'timestamp', nullable: true, comment: 'Thời điểm chốt lương' })
  finalizedAt: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => EmployeePerformance, (performance) => performance.monthlySummary)
  performances: EmployeePerformance[];
}
