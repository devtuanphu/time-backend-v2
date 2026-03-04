import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

export enum FeedbackType {
  APP_EXPERIENCE = 'app_experience',
  OPERATIONS = 'operations',
}

export enum FeedbackStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
}

@Entity('feedbacks')
export class Feedback extends BaseEntity {
  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'employee_profile_id', nullable: true })
  employeeProfileId: string;

  @Column({ name: 'account_id', nullable: true })
  accountId: string;

  @Column('simple-array', { name: 'categories', nullable: true })
  categories: string[]; // e.g. ['ui', 'feature', 'hr']

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column('simple-array', { name: 'attachments', nullable: true })
  attachments: string[]; // URLs of uploaded images/videos

  @Column({
    type: 'enum',
    enum: FeedbackStatus,
    default: FeedbackStatus.PENDING,
  })
  status: FeedbackStatus;

  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote: string;
}
