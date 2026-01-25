import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { Account } from '../../accounts/entities/account.entity';
import { PaymentType } from './employee-contract.entity';
import { SalaryAdjustmentReason } from './salary-adjustment-reason.entity';

export enum AdjustmentType {
  INCREASE = 'Tăng',
  DECREASE = 'Giảm',
}

export enum SalaryChangeType {
  AMOUNT = 'Số tiền',
  PERCENTAGE = 'Phần trăm',
}

@Entity('salary_adjustments')
export class SalaryAdjustment extends BaseEntity {
  @Column({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({
    name: 'adjustment_type',
    type: 'enum',
    enum: AdjustmentType,
  })
  adjustmentType: AdjustmentType;

  @Column({
    name: 'change_type',
    type: 'enum',
    enum: SalaryChangeType,
    default: SalaryChangeType.AMOUNT,
  })
  changeType: SalaryChangeType;

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: PaymentType,
  })
  paymentType: PaymentType;

  @Column({
    name: 'previous_salary',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  previousSalary: number;

  @Column({
    name: 'amount_value',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Giá trị nhập vào (số tiền hoặc %)'
  })
  amountValue: number;

  @Column({
    name: 'adjustment_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Số tiền quy đổi thực tế'
  })
  adjustmentAmount: number;

  @Column({
    name: 'new_salary',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  newSalary: number;

  @Column({ name: 'effective_month', type: 'date', comment: 'Tháng hiệu lực (Ngày 1 của tháng)' })
  effectiveMonth: Date;

  @Column({ name: 'reason_id', nullable: true })
  reasonId: string;

  @ManyToOne(() => SalaryAdjustmentReason)
  @JoinColumn({ name: 'reason_id' })
  reasonDetail: SalaryAdjustmentReason;

  @Column({ name: 'reason_text', type: 'text', nullable: true, comment: 'Lý do nhập tay nếu cần' })
  reasonText: string;

  @Column({ name: 'created_by_account_id' })
  createdByAccountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'created_by_account_id' })
  createdBy: Account;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;
}
