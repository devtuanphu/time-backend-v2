import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('user_devices')
export class UserDevice extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ unique: true, name: 'device_id' })
  deviceId: string;

  @Column({ name: 'expo_push_token' })
  expoPushToken: string;

  @Column()
  platform: 'android' | 'ios';

  @Column({ name: 'app_version', nullable: true })
  appVersion: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_seen_at', type: 'timestamp', nullable: true })
  lastSeenAt: Date;
}
