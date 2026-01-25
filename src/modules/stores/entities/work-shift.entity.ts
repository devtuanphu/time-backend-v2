import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('work_shifts')
export class WorkShift extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'shift_name' })
  shiftName: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'color_code', nullable: true })
  colorCode: string;

  @Column({ name: 'default_max_staff', type: 'int', default: 1 })
  defaultMaxStaff: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
