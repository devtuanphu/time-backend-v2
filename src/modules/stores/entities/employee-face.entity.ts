import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { Store } from './store.entity';

@Entity('employee_faces')
export class EmployeeFace extends BaseEntity {
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

  // 5 × 128-dim Float32Array descriptors stored as JSON
  @Column({ name: 'face_descriptors', type: 'jsonb', default: [] })
  faceDescriptors: number[][];

  // URLs of the original registration images
  @Column({ name: 'face_image_urls', type: 'jsonb', default: [] })
  faceImageUrls: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'registered_at', type: 'timestamp', default: () => 'NOW()' })
  registeredAt: Date;
}
