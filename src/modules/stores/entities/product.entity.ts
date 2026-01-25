import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { ProductUnit } from './product-unit.entity';
import { ProductCategory } from './product-category.entity';
import { ProductStatus } from './product-status.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string;

  @Column({ name: 'sku', nullable: true })
  sku: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'product_unit_id', nullable: true })
  productUnitId: string;

  @ManyToOne(() => ProductUnit, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_unit_id' })
  productUnit: ProductUnit;

  @Column({ name: 'product_category_id', nullable: true })
  productCategoryId: string;

  @ManyToOne(() => ProductCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_category_id' })
  productCategory: ProductCategory;

  @Column({ name: 'product_status_id', nullable: true })
  productStatusId: string;

  @ManyToOne(() => ProductStatus, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_status_id' })
  productStatus: ProductStatus;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  costPrice: number;

  @Column({
    name: 'selling_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  sellingPrice: number;

  @Column({ name: 'min_threshold', type: 'float', nullable: true })
  minThreshold: number;

  @Column({ name: 'max_threshold', type: 'float', nullable: true })
  maxThreshold: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

  @Column({ name: 'current_stock', type: 'float', default: 0 })
  currentStock: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
