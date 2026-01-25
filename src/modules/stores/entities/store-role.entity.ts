import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { StorePermissionConfig } from './store-permission-config.entity';

@Entity('store_roles')
export class StoreRole extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true })
  code: string; // MANAGER, WAITER

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 1,
    comment: 'Hệ số lương'
  })
  coefficient: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    comment: 'Phụ cấp cố định'
  })
  allowance: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'permission_config_id', nullable: true })
  permissionConfigId: string | null;

  @ManyToOne(() => StorePermissionConfig, (config) => config.roles, { nullable: true })
  @JoinColumn({ name: 'permission_config_id' })
  permissionConfig: StorePermissionConfig;
}
