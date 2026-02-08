import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ChatGroup } from './chat-group.entity';
import { Account } from '../../accounts/entities/account.entity';
import { EmployeeProfile } from '../../stores/entities/employee-profile.entity';

@Entity('chat_group_members')
export class ChatGroupMember extends BaseEntity {
  @Column({ type: 'uuid', name: 'group_id' })
  groupId: string;

  @ManyToOne(() => ChatGroup, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group: ChatGroup;

  @Column({ type: 'uuid', name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'uuid', nullable: true, name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({
    type: 'enum',
    enum: ['active', 'left', 'removed'],
    default: 'active',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_read_at' })
  lastReadAt: Date;

  @Column({ type: 'boolean', default: true, name: 'notifications_enabled' })
  notificationsEnabled: boolean;

  @Column({ nullable: true, name: 'chat_color' })
  chatColor: string;
}
