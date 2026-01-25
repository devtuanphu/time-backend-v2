import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('asset_statuses')
export class AssetStatus extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string; // e.g., Mới, Đang sử dụng, Đang sửa chữa, Đã thanh lý

  @Column({ name: 'color_code', nullable: true })
  colorCode: string; // e.g., #FF0000 for visual status on UI

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
