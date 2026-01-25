import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { EmployeeKpi } from './employee-kpi.entity';

export enum KpiRequestStatus {
  PENDING = 'Chờ duyệt',
  APPROVED = 'Chấp thuận',
  REJECTED = 'Từ chối',
}

@Entity('kpi_approval_requests')
export class KpiApprovalRequest extends BaseEntity {
  @Column({ name: 'employee_profile_id' })
  employeeProfileId: string;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile: EmployeeProfile;

  @Column({ name: 'employee_kpi_id' })
  employeeKpiId: string;

  @ManyToOne(() => EmployeeKpi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_kpi_id' })
  employeeKpi: EmployeeKpi;

  @Column({
    type: 'enum',
    enum: KpiRequestStatus,
    default: KpiRequestStatus.PENDING,
  })
  status: KpiRequestStatus;

  @Column({ name: 'reviewer_id', nullable: true })
  reviewerId: string;

  @ManyToOne(() => EmployeeProfile, { nullable: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: EmployeeProfile;

  @Column({ type: 'text', nullable: true })
  note: string | null; // Lý do từ chối hoặc ghi chú duyệt
}
