import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { KpiTask } from './kpi-task.entity';

export enum KpiStatus {
  DRAFT = 'Nháp',
  ACTIVE = 'Đang áp dụng',
  PAUSED = 'Tạm dừng',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã hủy',
}

@Entity('employee_kpis')
export class EmployeeKpi extends BaseEntity {
  @Column({ name: 'store_ids', type: 'uuid', array: true, nullable: true })
  storeIds: string[]; // Mảng ID các cửa hàng áp dụng

  @Column({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({ name: 'name' })
  name: string; // Tên bảng KPI

  @Column({ name: 'month', type: 'date', nullable: true })
  month: Date; // Tháng áp dụng (Vd: 2026-02-01)

  @Column({
    type: 'enum',
    enum: KpiStatus,
    default: KpiStatus.ACTIVE,
  })
  status: KpiStatus;

  @OneToMany(() => KpiTask, (task) => task.employeeKpi)
  tasks: KpiTask[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  reminders: string; // Nhắc nhở

  @Column({ type: 'text', nullable: true })
  compliments: string; // Lời khen
}
