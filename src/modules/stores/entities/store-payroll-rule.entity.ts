
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

export enum PayrollRuleCategory {
  BONUS = 'bonus',
  FINE = 'fine',
  BENEFIT = 'benefit',
}

export enum PayrollCalcType {
  AMOUNT = 'amount',
  PERCENTAGE = 'percentage',
  SHIFT = 'shift',
}

@Entity('store_payroll_rules')
export class StorePayrollRule extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: PayrollRuleCategory,
  })
  category: PayrollRuleCategory;

  @Column()
  name: string;

  @Column({ name: 'rule_type', nullable: true })
  ruleType: string; // e.g., 'ATTENDANCE', 'LATE', 'TET'

  @Column({
    type: 'enum',
    enum: PayrollCalcType,
    default: PayrollCalcType.AMOUNT,
    name: 'calc_type',
  })
  calcType: PayrollCalcType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  value: number;

  @Column({ name: 'is_custom', default: false })
  isCustom: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
