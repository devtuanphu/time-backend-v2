import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { StoreRole } from './store-role.entity';
import {
  SchedulePermissionDto,
  TimekeepingPermissionDto,
  HRPermissionDto,
  AssetPermissionDto,
  SalaryPermissionDto,
  ContentPermissionDto,
  ReportPermissionDto,
  SystemPermissionDto,
  EmployeeNotificationDto,
  ShiftLeaderNotificationDto,
  ManagerNotificationDto,
  StoreNotificationDto,
} from '../dto/store-permission-config.dto';

@Entity('store_permission_configs')
export class StorePermissionConfig extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true, comment: 'Tên cấu hình mẫu (VD: Quản lý, Nhân viên)' })
  name: string;

  @Column({ name: 'role_id', type: 'varchar', nullable: true, comment: 'Nếu null => Template, nếu có => Config riêng của Role' })
  roleId: string | null;

  @OneToMany(() => StoreRole, (role) => role.permissionConfig)
  roles: StoreRole[];

  // --- Permissions Columns (JSONB) ---
  @Column({ type: 'jsonb', default: {} })
  schedule: SchedulePermissionDto;

  @Column({ type: 'jsonb', default: {} })
  timekeeping: TimekeepingPermissionDto;

  @Column({ type: 'jsonb', default: {} })
  hr: HRPermissionDto;

  @Column({ type: 'jsonb', default: {} })
  asset: AssetPermissionDto;

  @Column({ type: 'jsonb', default: {} })
  salary: SalaryPermissionDto;

  @Column({ type: 'jsonb', default: {} })
  content: ContentPermissionDto;

  @Column({ type: 'jsonb', default: {} })
  report: ReportPermissionDto;

  @Column({ type: 'jsonb', default: {} })
  system: SystemPermissionDto;

  // --- Notifications Columns (JSONB) ---
  @Column({ type: 'jsonb', default: {} })
  employeeNotification: EmployeeNotificationDto;

  @Column({ type: 'jsonb', default: {} })
  shiftLeaderNotification: ShiftLeaderNotificationDto;

  @Column({ type: 'jsonb', default: {} })
  managerNotification: ManagerNotificationDto;

  @Column({ type: 'jsonb', default: {} })
  storeNotification: StoreNotificationDto;
}
