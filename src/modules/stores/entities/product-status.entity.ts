import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('product_statuses')
export class ProductStatus extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string; // e.g., Đang bán, Ngừng kinh doanh, Hết hàng

  @Column({ name: 'color_code', nullable: true })
  colorCode: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
