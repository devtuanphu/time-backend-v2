import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

export enum StoreEventType {
  GREETING = 'greeting',
  CONTRACT_EXTENSION = 'contract_extension',
  INTERVIEW = 'interview',
}

@Entity('store_events')
export class StoreEvent extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: StoreEventType,
  })
  type: StoreEventType;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'event_date', type: 'date' })
  eventDate: string; // YYYY-MM-DD

  @Column({ name: 'event_time', type: 'time', nullable: true })
  eventTime: string; // HH:mm:ss
}
