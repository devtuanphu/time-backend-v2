import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Account } from './account.entity';

export enum AppType {
  OWNER_APP = 'OWNER_APP',
  EMPLOYEE_APP = 'EMPLOYEE_APP',
}

@Entity('account_refresh_tokens')
export class AccountRefreshToken extends BaseEntity {
  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'token_hash', unique: true })
  tokenHash: string;

  @Column({ name: 'app_type', type: 'enum', enum: AppType })
  appType: AppType;

  @Column({ name: 'device_id', nullable: true })
  deviceId: string;

  @Column({ name: 'device_name', nullable: true })
  deviceName: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'issued_at' })
  issuedAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'revoked_at', nullable: true })
  revokedAt: Date;
}
