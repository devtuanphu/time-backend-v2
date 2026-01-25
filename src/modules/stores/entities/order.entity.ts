import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { ServiceItem } from './service-item.entity';

// Enums
export enum OrderStatus {
  PREPARING = 'PREPARING', // Chuẩn bị
  DELIVERING = 'DELIVERING', // Đang giao
  COMPLETED = 'COMPLETED', // Thành công
  FAILED = 'FAILED', // Thất bại
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
  E_WALLET = 'E_WALLET',
  MULTIPLE = 'MULTIPLE',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

export enum ServiceType {
  FNB = 'FNB',
  RETAIL = 'RETAIL',
  PERSONAL_CARE = 'PERSONAL_CARE',
  PET_CARE = 'PET_CARE',
  YIELD_DELIVERY = 'YIELD_DELIVERY',
}

// Order Entity
@Entity('orders')
export class Order extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ unique: true })
  code: string; // Auto-generated: FB001, RET002, SPA003...

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;

  // === THÔNG TIN KHÁCH HÀNG (CHUNG) ===
  @Column({ name: 'customer_name', nullable: true })
  customerName?: string;

  @Column({ name: 'customer_phone', nullable: true })
  customerPhone?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  ward?: string;

  @Column({ name: 'address_line', nullable: true })
  addressLine?: string;

  @Column({ name: 'delivery_date', nullable: true })
  deliveryDate?: string;

  @Column({ name: 'delivery_time', nullable: true })
  deliveryTime?: string;

  // === NHÂN VIÊN ===
  @Column({ name: 'employee_id', nullable: true })
  employeeId?: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeProfile;

  // === TÍNH TIỀN (CHUNG) ===
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number; // Tổng tiền dịch vụ/sản phẩm (chưa giảm giá, chưa thuế)

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number; // % giảm giá

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number; // Số tiền giảm giá

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxPercent: number; // % thuế (VAT)

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number; // Số tiền thuế

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number; // Tổng tiền thanh toán = subtotal - discount + tax

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalCost: number; // Tổng giá vốn của tất cả item trong đơn

  // === THANH TOÁN (CHUNG) ===
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: number; // Số tiền đã thanh toán

  // === TRẠNG THÁI ===
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // === THÔNG TIN RIÊNG THEO LOẠI (JSONB) ===
  @Column({ type: 'jsonb', nullable: true })
  orderDetails?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}

// Order Item Entity
@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'service_item_id' })
  serviceItemId: string;

  @ManyToOne(() => ServiceItem, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_item_id' })
  serviceItem: ServiceItem;

  // Snapshot of item at time of order (for history)
  @Column({ type: 'jsonb' })
  itemSnapshot: {
    name: string;
    size?: string;
    price: number;
    duration?: number;
    metadata?: Record<string, any>;
  };

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number; // quantity × unitPrice

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  unitCost: number; // Giá vốn của 1 đơn vị món

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalCost: number; // quantity × unitCost

  @Column({ type: 'text', nullable: true })
  note?: string; // Ghi chú riêng cho món này (VD: "Ít đường", "Không hành")
}
