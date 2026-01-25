import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('employee_termination_reasons')
export class EmployeeTerminationReason extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string; // ví dụ: Nghỉ việc, Đuổi việc, Hết hạn hợp đồng...

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
