import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('stores')
export class Store extends BaseEntity {
  @Column({ name: 'owner_account_id' })
  ownerAccountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_account_id' })
  owner: Account;

  @Column()
  name: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  ward: string;

  @Column({ name: 'address_line', nullable: true })
  addressLine: string;

  @Column({ name: 'tax_code', nullable: true })
  taxCode: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ name: 'employee_range_label', nullable: true })
  employeeRangeLabel: string;

  @Column({ name: 'years_active_label', nullable: true })
  yearsActiveLabel: string;

  @Column({ name: 'qr_code', nullable: true })
  qrCode: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'enum', enum: StoreStatus, default: StoreStatus.ACTIVE })
  status: StoreStatus;
}
