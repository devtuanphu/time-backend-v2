import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PaymentType } from './employee-contract.entity';

@Entity('contract_templates')
export class ContractTemplate extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @Column({ name: 'template_name' })
  templateName: string;

  @Column({ name: 'template_type', nullable: true })
  templateType: string;

  @Column({ name: 'job_description', type: 'text', nullable: true })
  jobDescription: string;

  @Column({
    name: 'weekly_working_hours',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  weeklyWorkingHours: number;

  @Column({ name: 'probation_period', nullable: true })
  probationPeriod: string;

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: PaymentType,
    nullable: true,
  })
  paymentType: PaymentType;

  @Column({
    name: 'salary_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  salaryAmount: number;

  @Column({ type: 'jsonb', nullable: true })
  allowances: Record<string, number>;

  @Column({ type: 'jsonb', nullable: true })
  terms: Array<{ title: string; content: string }>;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
