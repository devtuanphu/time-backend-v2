import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { Product } from './product.entity';

// Enum for service types
export enum ServiceType {
  FNB = 'FNB',
  RETAIL = 'RETAIL',
  PERSONAL_CARE = 'PERSONAL_CARE',
  PET_CARE = 'PET_CARE',
  YIELD_DELIVERY = 'YIELD_DELIVERY',
}

// Service Category
@Entity('service_categories')
export class ServiceCategory extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => ServiceItem, (item) => item.category)
  items: ServiceItem[];
}

// Service Item (Menu/Product sold to customers)
@Entity('service_items')
export class ServiceItem extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => ServiceCategory, (category) => category.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: ServiceCategory;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ nullable: true })
  size?: string; // For items with different sizes (S, M, L)

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Important field - Duration for services (PERSONAL_CARE, PET_CARE)
  @Column({ type: 'int', nullable: true })
  duration?: number; // In minutes

  // Flexible metadata for type-specific attributes
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => ServiceItemRecipe, (recipe) => recipe.serviceItem)
  recipes: ServiceItemRecipe[];
}

// Service Item Recipe (Bill of Materials - BOM)
@Entity('service_item_recipes')
export class ServiceItemRecipe extends BaseEntity {
  @Column({ name: 'service_item_id' })
  serviceItemId: string;

  @ManyToOne(() => ServiceItem, (item) => item.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_item_id' })
  serviceItem: ServiceItem;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantity: number;

  @Column({ nullable: true })
  unit?: string; // Unit for clarity (g, ml, cái, etc.)

  @Column({ type: 'text', nullable: true })
  note?: string;
}
