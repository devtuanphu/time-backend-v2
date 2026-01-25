import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { EmployeeProfile } from './employee-profile.entity';
import { StoreRole } from './store-role.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('employee_profile_roles')
export class EmployeeProfileRole {
  @PrimaryColumn({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @PrimaryColumn({ name: 'store_role_id' })
  storeRoleId: string;

  @ManyToOne(() => StoreRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_role_id' })
  storeRole: StoreRole;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @Column({ name: 'assigned_by_account_id', nullable: true })
  assignedByAccountId: string;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_by_account_id' })
  assignedByAccount: Account;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
