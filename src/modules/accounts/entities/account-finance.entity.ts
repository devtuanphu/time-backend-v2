import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('account_finance')
export class AccountFinance {
  @PrimaryColumn({ name: 'account_id' })
  accountId: string;

  @OneToOne(() => Account, (account) => account.finance)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'bank_name', nullable: true })
  bankName: string;

  @Column({ name: 'bank_number', nullable: true })
  bankNumber: string;

  @Column({ name: 'tax_code', nullable: true })
  taxCode: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
