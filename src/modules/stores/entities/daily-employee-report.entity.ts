import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('daily_employee_reports')
export class DailyEmployeeReport extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'report_date', type: 'date' })
  reportDate: Date;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  lateArrivals: string[]; // List of EmployeeProfile IDs

  @Column({ type: 'jsonb', nullable: true, default: [] })
  earlyDepartures: string[]; // List of EmployeeProfile IDs

  @Column({ type: 'jsonb', nullable: true, default: [] })
  forgotClockOut: string[]; // List of EmployeeProfile IDs

  @Column({ type: 'jsonb', nullable: true, default: [] })
  unauthorizedLeaves: string[]; // List of EmployeeProfile IDs

  @Column({ type: 'jsonb', nullable: true, default: [] })
  extraShifts: string[]; // List of EmployeeProfile IDs

  @Column({ type: 'jsonb', nullable: true, default: [] })
  authorizedLeaves: string[]; // List of EmployeeProfile IDs

  @Column({ type: 'text', nullable: true })
  note: string;
}
