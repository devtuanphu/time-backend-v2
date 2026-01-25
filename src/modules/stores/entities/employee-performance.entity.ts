import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { Account } from '../../accounts/entities/account.entity';
import { EmployeeMonthlySummary } from './employee-monthly-summary.entity';

export enum PerformanceType {
  MANAGER = 'Quản lý',
  PEER = 'Đồng nghiệp',
  SELF = 'Tự đánh giá',
  SYSTEM = 'Hệ thống',
}

@Entity('employee_performances')
export class EmployeePerformance extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({ name: 'monthly_summary_id', nullable: true })
  monthlySummaryId: string;

  @ManyToOne(() => EmployeeMonthlySummary, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'monthly_summary_id' })
  monthlySummary: EmployeeMonthlySummary;

  @Column({ name: 'reviewer_account_id', nullable: true })
  reviewerAccountId: string;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewer_account_id' })
  reviewerAccount: Account;

  @Column({
    type: 'enum',
    enum: PerformanceType,
    default: PerformanceType.SYSTEM,
  })
  type: PerformanceType;

  @Column({ nullable: true, comment: 'Tiêu đề đánh giá (VD: Đánh giá Quý 1/2025)' })
  title: string;

  @Column({ type: 'text', comment: 'Nội dung nhận xét chi tiết' })
  content: string;

  @Column({ nullable: true, comment: 'Nhãn đánh giá (Tốt, Trung bình, Xuất sắc...)' })
  ratingLabel: string;

  @Column({ type: 'int', default: 0, comment: 'Điểm số cụ thể' })
  score: number;

  @Column({ name: 'performance_date', type: 'date' })
  performanceDate: Date;
}
