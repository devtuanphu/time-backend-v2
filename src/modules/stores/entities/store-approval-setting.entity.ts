
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

@Entity('store_approval_settings')
export class StoreApprovalSetting extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  // -- Bật/Tắt phê duyệt các yêu cầu --
  @Column({ name: 'enable_shift_registration', default: true })
  enableShiftRegistration: boolean;

  @Column({ name: 'enable_leave_request', default: true })
  enableLeaveRequest: boolean; // Xin đi trễ / về sớm / nghỉ phép / vắng mặt

  @Column({ name: 'enable_shift_swap', default: true })
  enableShiftSwap: boolean;

  // -- Cài đặt người phê duyệt --
  @Column({ name: 'primary_approver_id', nullable: true })
  primaryApproverId: string;

  @ManyToOne('EmployeeProfile', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'primary_approver_id' })
  primaryApprover: any;

  @Column({ name: 'backup_approver_id', nullable: true })
  backupApproverId: string;

  @ManyToOne('EmployeeProfile', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'backup_approver_id' })
  backupApprover: any;


  // -- Thời gian tối thiểu cần báo trước & Giới hạn số lần --

  // Xin nghỉ / vắng mặt
  @Column({ name: 'leave_notice_hours', type: 'int', default: 24 })
  leaveNoticeHours: number; // Báo trước ? giờ

  @Column({ name: 'leave_limit_per_month', type: 'int', default: 2 })
  leaveLimitPerMonth: number; // Tối đa ? lần/tháng

  // Đổi ca
  @Column({ name: 'swap_notice_hours', type: 'int', default: 12 })
  swapNoticeHours: number;

  @Column({ name: 'swap_limit_per_month', type: 'int', default: 2 })
  swapLimitPerMonth: number;

  // Đi trễ / về sớm
  @Column({ name: 'late_early_notice_hours', type: 'int', default: 2 })
  lateEarlyNoticeHours: number;

  @Column({ name: 'late_early_limit_per_month', type: 'int', default: 2 })
  lateEarlyLimitPerMonth: number;

  // -- Thời gian mở/khóa đăng ký ca --
  // Lưu giờ phút dạng chuỗi "08:00"
  @Column({ name: 'shift_register_open_time', default: '08:00' })
  shiftRegisterOpenTime: string;

  @Column({ name: 'shift_register_open_day', default: 'Monday' })
  shiftRegisterOpenDay: string; // Thứ 2 hàng tuần

  @Column({ name: 'shift_register_close_time', default: '00:00' })
  shiftRegisterCloseTime: string;

  @Column({ name: 'shift_register_close_day', default: 'Thursday' })
  shiftRegisterCloseDay: string; // Thứ 5 hàng tuần

  // -- Gợi ý cảnh báo khi thiếu người --
  @Column({ name: 'personnel_warning_hours', type: 'int', default: 24 })
  personnelWarningHours: number; // Báo trước ? giờ trước khi vào ca

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
