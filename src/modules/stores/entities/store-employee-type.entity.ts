import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('store_employee_types')
export class StoreEmployeeType extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true })
  code: string; // FULL_TIME, PART_TIME

  @Column()
  name: string;

  @Column({ type: 'int', default: 0, comment: 'Cấp độ thăng tiến (1, 2, 3...)' })
  level: number;

  @Column({ nullable: true, comment: 'Tên kỹ năng tương ứng (VD: Học việc, Thạo việc)' })
  skillName: string;

  @Column({
    name: 'req_on_time_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: '% ca đúng giờ tối thiểu',
  })
  reqOnTimePercent: number;

  @Column({
    name: 'req_max_unauthorized_leave',
    type: 'int',
    default: 0,
    comment: 'Số ngày nghỉ không phép tối đa',
  })
  reqMaxUnauthorizedLeave: number;

  @Column({
    name: 'req_min_capability_points',
    type: 'int',
    default: 0,
    comment: 'Điểm năng lực tối thiểu',
  })
  reqMinCapabilityPoints: number;

  @Column({
    name: 'req_no_complaints',
    type: 'boolean',
    default: false,
    comment: 'Yêu cầu không được có phản ánh',
  })
  reqNoComplaints: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
