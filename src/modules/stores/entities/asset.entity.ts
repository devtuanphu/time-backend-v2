import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { AssetUnit } from './asset-unit.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { AssetCategory } from './asset-category.entity';
import { AssetStatus } from './asset-status.entity';

@Entity('assets')
export class Asset extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string;

  @Column({ name: 'code', nullable: true })
  code: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'asset_unit_id', nullable: true })
  assetUnitId: string;

  @ManyToOne(() => AssetUnit, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'asset_unit_id' })
  assetUnit: AssetUnit;

  @Column({ name: 'asset_category_id', nullable: true })
  assetCategoryId: string;

  @ManyToOne(() => AssetCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'asset_category_id' })
  assetCategory: AssetCategory;

  @Column({
    name: 'value',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  value: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;


  @Column({ name: 'asset_status_id', nullable: true })
  assetStatusId: string;

  @ManyToOne(() => AssetStatus, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'asset_status_id' })
  assetStatus: AssetStatus;

  @Column({ name: 'purchase_date', type: 'date', nullable: true })
  purchaseDate: string;

  @Column({ name: 'supplier_name', nullable: true })
  supplierName: string;

  @Column({ name: 'supplier_phone', nullable: true })
  supplierPhone: string;

  @Column({ name: 'invoice_file_url', nullable: true })
  invoiceFileUrl: string;

  @Column({ name: 'current_stock', type: 'float', default: 0 })
  currentStock: number;

  @Column({ name: 'min_stock', type: 'float', default: 0 })
  minStock: number;

  @Column({ name: 'max_stock', type: 'float', nullable: true })
  maxStock: number;

  @Column({ name: 'responsible_employee_id', nullable: true })
  responsibleEmployeeId: string;

  @ManyToOne(() => EmployeeProfile, { nullable: true })
  @JoinColumn({ name: 'responsible_employee_id' })
  responsibleEmployee: EmployeeProfile;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
