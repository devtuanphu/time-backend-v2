import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { Product } from './product.entity';
import { Asset } from './asset.entity';
import { AssetExportType } from './asset-export-type.entity';
import { ProductExportType } from './product-export-type.entity';


export enum StockTransactionType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  ADJUST = 'ADJUST',
}

export enum StockTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('stock_transactions')
export class StockTransaction extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: StockTransactionType,
  })
  type: StockTransactionType;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'employee_id', nullable: true })
  employeeId?: string;

  @ManyToOne(() => EmployeeProfile, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeProfile;


  @Column({ name: 'partner_name', nullable: true })
  partnerName: string;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({
    name: 'transaction_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transactionDate: Date;

  @Column({
    type: 'enum',
    enum: StockTransactionStatus,
    default: StockTransactionStatus.COMPLETED,
  })
  status: StockTransactionStatus;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'asset_export_type_id', nullable: true })
  assetExportTypeId: string;

  @ManyToOne(() => AssetExportType)
  @JoinColumn({ name: 'asset_export_type_id' })
  assetExportType: AssetExportType;

  @Column({ name: 'product_export_type_id', nullable: true })
  productExportTypeId: string;

  @ManyToOne(() => ProductExportType)
  @JoinColumn({ name: 'product_export_type_id' })
  productExportType: ProductExportType;


  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;

  @OneToMany(() => StockTransactionDetail, (detail) => detail.transaction)
  details: StockTransactionDetail[];
}

@Entity('stock_transaction_details')
export class StockTransactionDetail extends BaseEntity {
  @Column({ name: 'transaction_id' })
  transactionId: string;

  @ManyToOne(() => StockTransaction, (transaction) => transaction.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: StockTransaction;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'asset_id', nullable: true })
  assetId: string;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ type: 'float' })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  unitPrice: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalPrice: number;
  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;
}

