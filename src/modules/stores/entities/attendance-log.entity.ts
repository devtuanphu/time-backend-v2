import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { Store } from './store.entity';
import { ShiftAssignment } from './shift-management.entity';

export enum AttendanceLogType {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
}

export enum AttendanceMethod {
  FACE = 'FACE',
  MANUAL = 'MANUAL',
}

@Entity('attendance_logs')
export class AttendanceLog extends BaseEntity {
  @Column({ name: 'shift_assignment_id' })
  shiftAssignmentId: string;

  @ManyToOne(() => ShiftAssignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shift_assignment_id' })
  shiftAssignment: ShiftAssignment;

  @Column({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: AttendanceLogType,
  })
  type: AttendanceLogType;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: AttendanceMethod,
    default: AttendanceMethod.FACE,
  })
  method: AttendanceMethod;

  @Column({
    name: 'face_match_score',
    type: 'decimal',
    precision: 6,
    scale: 4,
    nullable: true,
    comment: 'Euclidean distance (lower = better match, < 0.6 = match)',
  })
  faceMatchScore: number;

  @Column({ name: 'face_image_url', nullable: true })
  faceImageUrl: string;

  @Column({ name: 'device_info', nullable: true })
  deviceInfo: string;
}
