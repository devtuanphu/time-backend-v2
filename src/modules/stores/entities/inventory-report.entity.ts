import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { Asset } from './asset.entity';
import { Product } from './product.entity';
import { AssetStatus } from './asset-status.entity';

export enum InventoryReportType {
  ASSET = 'Tài sản',
  PRODUCT = 'Hàng hóa',
}



export enum InventoryReportStatus {
  PENDING = 'Chờ xử lý',
  PROCESSING = 'Đang xử lý',
  RESOLVED = 'Đã hoàn thành',
  REJECTED = 'Từ chối',
}

@Entity('inventory_reports')
export class InventoryReport extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'reporter_id' })
  reporterId: string;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'reporter_id' })
  reporter: EmployeeProfile;

  @Column({
    type: 'enum',
    enum: InventoryReportType,
  })
  type: InventoryReportType;


  @Column({ name: 'asset_id', nullable: true })
  assetId: string;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'target_asset_status_id', nullable: true })
  targetAssetStatusId: string; // Trạng thái tài sản đề xuất (Vd: Chọn trạng thái "Hư hỏng")

  @ManyToOne(() => AssetStatus, { nullable: true })
  @JoinColumn({ name: 'target_asset_status_id' })
  targetAssetStatus: AssetStatus;

  @Column({ nullable: true })
  supplierPhone: string; // Số điện thoại nhà cung cấp

  @Column({ type: 'text', nullable: true })
  description: string; // Mô tả hư hỏng/tình trạng

  @Column({ type: 'text', array: true, nullable: true })
  images: string[]; // Danh sách ảnh đính kèm

  @Column({
    type: 'enum',
    enum: InventoryReportStatus,
    default: InventoryReportStatus.PENDING,
  })
  status: InventoryReportStatus;

  @Column({ type: 'text', nullable: true })
  adminNote: string; // Ghi chú từ quản lý khi xử lý
}
