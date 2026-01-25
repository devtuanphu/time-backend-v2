
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { PayrollCalcType } from './store-payroll-rule.entity';

export enum IncrementRuleType {
  PERIODIC = 'periodic',   // Xét duyệt định kỳ (VD: 01/06)
  SENIORITY = 'seniority', // Theo thâm niên (VD: 6 tháng)
}

@Entity('store_payroll_increment_rules')
export class StorePayrollIncrementRule extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: IncrementRuleType,
  })
  type: IncrementRuleType;

  @Column({ name: 'condition_type' })
  conditionType: string; // e.g., 'DATE', 'DAYS'

  @Column({ name: 'condition_value' })
  conditionValue: string; // e.g., '01/06', '180'

  @Column({
    type: 'enum',
    enum: PayrollCalcType,
    default: PayrollCalcType.AMOUNT,
    name: 'calc_type',
  })
  calcType: PayrollCalcType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  value: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
