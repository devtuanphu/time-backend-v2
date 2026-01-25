import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('product_units')
export class ProductUnit extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string; // e.g., Kg, Thùng, Lon, Lít, Gram

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
