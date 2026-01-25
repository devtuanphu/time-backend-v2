import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('store_probation_settings')
export class StoreProbationSetting extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  // -- Chu kỳ thử việc --
  @Column({ name: 'probation_days', type: 'int', default: 0 })
  probationDays: number; // Số ngày thử việc

  @Column({ name: 'probation_shifts', type: 'int', default: 0 })
  probationShifts: number; // Số ca thử việc

  @Column({ name: 'notify_evaluation', default: false })
  notifyEvaluation: boolean; // Kích hoạt thông báo nhắc đánh giá

  @Column({ name: 'notify_result_to_employee', default: false })
  notifyResultToEmployee: boolean; // Thông báo kết quả cho nhân viên

  @Column({ name: 'auto_close_checklist', default: false })
  autoCloseChecklist: boolean; // In/đóng file checklist khi kết thúc

  // -- Checklist đánh giá (JSON) --  
  // Tiêu chí về chuyên cần
  @Column({ type: 'jsonb', nullable: true, name: 'attendance_checklist' })
  attendanceChecklist: any[];

  // Tiêu chí về thái độ và kỹ năng
  @Column({ type: 'jsonb', nullable: true, name: 'attitude_checklist' })
  attitudeChecklist: any[];

  // -- Thiết lập thưởng hoàn thành thử việc --
  @Column({ name: 'enable_completion_bonus', default: false })
  enableCompletionBonus: boolean;

  @Column({ name: 'completion_bonus', type: 'decimal', precision: 12, scale: 2, default: 0 })
  completionBonus: number; // Mức thưởng

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
