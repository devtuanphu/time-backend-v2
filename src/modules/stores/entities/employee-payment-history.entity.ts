import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { EmployeeProfile } from './employee-profile.entity';

@Entity('employee_payment_histories')
export class EmployeePaymentHistory extends BaseEntity {
  @Column({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_name', nullable: true })
  storeName: string;

  @Column({ name: 'amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({ name: 'payment_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ name: 'salary_month', type: 'date' })
  salaryMonth: Date;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ name: 'reference_number', nullable: true })
  referenceNumber: string;

  @Column({ name: 'payment_account_id', nullable: true })
  paymentAccountId: string;

  @Column({ name: 'payment_account_info', nullable: true, comment: 'Thông tin tài khoản ngân hàng lúc thanh toán (VD: VIB - ****6789)' })
  paymentAccountInfo: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
