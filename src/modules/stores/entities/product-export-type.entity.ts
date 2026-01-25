import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('product_export_types')
export class ProductExportType extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string; // e.g., Hủy bỏ, Xuất bán, Trả hàng nhà cung cấp

  @Column({ name: 'color_code', nullable: true })
  colorCode: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
