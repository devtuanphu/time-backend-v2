import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export type TemplateFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'currency'
  | 'textarea';

export interface TemplateField {
  key: string; // VD: "salary", "startDate", "position"
  label: string; // VD: "Lương cơ bản"
  type: TemplateFieldType;
  placeholder?: string; // VD: "{{salary}}" - hiển thị trong file
  options?: string[]; // cho type='select'
  required?: boolean;
  defaultValue?: string;
  exampleValue?: string; // VD: "10.000.000 VNĐ/tháng"
}

@Entity('contract_templates')
export class ContractTemplate extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @Column({ name: 'template_name' })
  templateName: string;

  @Column({ name: 'template_type', nullable: true })
  templateType: string;

  /** URL file template (PDF/DOCX) đã upload lên S3/minio */
  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;

  /** Loại file: pdf | docx */
  @Column({ name: 'file_type', nullable: true })
  fileType: string;

  /**
   * Danh sách placeholder fields.
   * VD: [{ key: "salary", label: "Lương", type: "currency" }, ...]
   */
  @Column({ type: 'jsonb', nullable: true })
  fields: TemplateField[];

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
