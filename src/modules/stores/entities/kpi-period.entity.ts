import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('kpi_periods')
export class KpiPeriod extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string; // VD: "Tháng 02/2026", "Quý 1", "Năm 2026"

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
