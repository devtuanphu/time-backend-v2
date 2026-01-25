
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

export enum PayrollCalculationMethod {
  HOUR = 'hour',
  SHIFT = 'shift',
  DAY = 'day',
  MONTH = 'month',
  FLEXIBLE = 'flexible',
}

@Entity('store_payroll_settings')
export class StorePayrollSetting extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: PayrollCalculationMethod,
    default: PayrollCalculationMethod.FLEXIBLE,
    name: 'calculation_method',
  })
  calculationMethod: PayrollCalculationMethod;

  @Column({ name: 'priority_calc_type', nullable: true })
  priorityCalcType: string; // e.g., 'Theo ca'

  @Column({ name: 'priority_calc_value', type: 'decimal', precision: 12, scale: 2, default: 0 })
  priorityCalcValue: number;

  @Column({ name: 'alternative_calc_type', nullable: true })
  alternativeCalcType: string; // e.g., 'Theo giờ'

  @Column({ name: 'alternative_calc_value', type: 'decimal', precision: 12, scale: 2, default: 0 })
  alternativeCalcValue: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
