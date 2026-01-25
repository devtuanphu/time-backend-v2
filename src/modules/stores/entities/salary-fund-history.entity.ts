import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('salary_fund_histories')
export class SalaryFundHistory extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'date' })
  month: Date;

  @Column({ name: 'old_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  oldValue: number;

  @Column({ name: 'new_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  newValue: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ name: 'changed_by', nullable: true })
  changedBy: string; // ID of the account who made the change
}
