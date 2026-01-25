import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmployeeKpi } from './employee-kpi.entity';
import { KpiType } from './kpi-type.entity';
import { KpiUnit } from './kpi-unit.entity';
import { KpiPeriod } from './kpi-period.entity';
import { Store } from './store.entity';

@Entity('kpi_tasks')
export class KpiTask extends BaseEntity {
  @Column({ name: 'employee_kpi_id' })
  employeeKpiId: string;

  @ManyToOne(() => EmployeeKpi, (kpi) => kpi.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_kpi_id' })
  employeeKpi: EmployeeKpi;

  @Column({ name: 'task_name' })
  taskName: string; // Tên nhiệm vụ

  @Column({ name: 'kpi_unit_id', nullable: true })
  kpiUnitId: string;

  @ManyToOne(() => KpiUnit, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'kpi_unit_id' })
  kpiUnit: KpiUnit; // Đơn vị đo lường

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  target: number; // Mục tiêu

  @Column({
    name: 'actual_value',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  actualValue: number; // Giá trị thực tế đạt được

  @Column({
    name: 'completion_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  completionRate: number; // Tỷ lệ hoàn thành (%)

  @Column({ name: 'kpi_period_id', nullable: true })
  kpiPeriodId: string;

  @ManyToOne(() => KpiPeriod, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'kpi_period_id' })
  kpiPeriod: KpiPeriod; // Kỳ đo lường

  @Column({ name: 'kpi_type_id', nullable: true })
  kpiTypeId: string;

  @ManyToOne(() => KpiType, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'kpi_type_id' })
  kpiType: KpiType; // Loại KPI

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'store_id' })
  store: Store; // Chi nhánh áp dụng

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;
}
