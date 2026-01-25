import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';
import { WorkShift } from './work-shift.entity';
import { EmployeeProfile } from './employee-profile.entity';

// --- ENUMS ---

export enum WorkCycleStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export enum ShiftAssignmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ShiftSwapStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// --- ENTITIES ---

@Entity('work_cycles')
export class WorkCycle extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  name: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ name: 'registration_deadline', type: 'timestamp', nullable: true })
  registrationDeadline: Date;

  @Column({
    type: 'enum',
    enum: WorkCycleStatus,
    default: WorkCycleStatus.DRAFT,
  })
  status: WorkCycleStatus;

  @OneToMany(() => ShiftSlot, (slot) => slot.cycle)
  slots: ShiftSlot[];
}

@Entity('shift_slots')
export class ShiftSlot extends BaseEntity {
  @Column({ name: 'cycle_id' })
  cycleId: string;

  @ManyToOne(() => WorkCycle, (cycle) => cycle.slots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cycle_id' })
    cycle: WorkCycle;

    @Column({ name: 'work_shift_id' })
    workShiftId: string;

    @ManyToOne(() => WorkShift, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'work_shift_id' })
    workShift: WorkShift;

    @Column({ name: 'work_date', type: 'date' })
    workDate: string;

    @Column({ name: 'max_staff', type: 'int', default: 1 })
    maxStaff: number;

    @Column({ type: 'text', nullable: true })
    note?: string;

    @OneToMany(() => ShiftAssignment, (assignment) => assignment.shiftSlot)
    assignments: ShiftAssignment[];
}

@Entity('shift_assignments')
export class ShiftAssignment extends BaseEntity {
    @Column({ name: 'shift_slot_id' })
    shiftSlotId: string;

    @ManyToOne(() => ShiftSlot, (slot) => slot.assignments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'shift_slot_id' })
    shiftSlot: ShiftSlot;

    @Column({ name: 'employee_id' })
    employeeId: string;

    @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeProfile;

    @Column({
        type: 'enum',
        enum: ShiftAssignmentStatus,
        default: ShiftAssignmentStatus.PENDING,
    })
    status: ShiftAssignmentStatus;

    @Column({ name: 'check_in_time', type: 'timestamp', nullable: true })
    checkInTime: Date;

    @Column({ name: 'check_out_time', type: 'timestamp', nullable: true })
    checkOutTime: Date;

    @Column({ type: 'text', nullable: true })
    note?: string;
}

@Entity('shift_swaps')
export class ShiftSwap extends BaseEntity {
    @Column({ name: 'from_assignment_id' })
    fromAssignmentId: string;

    @ManyToOne(() => ShiftAssignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_assignment_id' })
  fromAssignment: ShiftAssignment;

  @Column({ name: 'to_employee_id', nullable: true })
  toEmployeeId: string;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'to_employee_id' })
  toEmployee: EmployeeProfile;

  @Column({ name: 'requested_by_employee_id' })
  requestedByEmployeeId: string;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'requested_by_employee_id' })
  requestedByEmployee: EmployeeProfile;

  @Column({
    type: 'enum',
    enum: ShiftSwapStatus,
    default: ShiftSwapStatus.PENDING,
  })
  status: ShiftSwapStatus;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
