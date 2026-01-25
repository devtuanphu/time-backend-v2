import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Account } from './account.entity';

export enum VerifiedStatus {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('account_identity_documents')
export class AccountIdentityDocument extends BaseEntity {
  @Column({ name: 'account_id' })
  accountId: string;

  @OneToOne(() => Account, (account) => account.identityDocument)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'doc_type', default: 'CCCD' })
  docType: string;

  @Column({ name: 'document_number', nullable: true })
  documentNumber: string;

  @Column({ name: 'front_image_url', nullable: true })
  frontImageUrl: string;

  @Column({ name: 'back_image_url', nullable: true })
  backImageUrl: string;

  @Column({
    name: 'verified_status',
    type: 'enum',
    enum: VerifiedStatus,
    default: VerifiedStatus.VERIFIED,
  })
  verifiedStatus: VerifiedStatus;
}
