import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsIn,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export const TEMPLATE_FIELD_TYPES = [
  'text',
  'number',
  'date',
  'select',
  'currency',
  'textarea',
] as const;
export type TemplateFieldTypeEnum = (typeof TEMPLATE_FIELD_TYPES)[number];

export class TemplateFieldDto {
  @ApiProperty({
    example: 'salary',
    description: 'Key duy nhất dùng để replace vào file',
  })
  @IsString()
  key: string;

  @ApiProperty({
    example: 'Lương cơ bản',
    description: 'Nhãn hiển thị cho manager',
  })
  @IsString()
  label: string;

  @ApiProperty({ example: 'currency', enum: TEMPLATE_FIELD_TYPES })
  @IsString()
  @IsIn(TEMPLATE_FIELD_TYPES)
  type: TemplateFieldTypeEnum;

  @ApiProperty({
    example: '{{salary}}',
    description: 'Placeholder trong file - sẽ được replace bằng giá trị thực',
    required: false,
  })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({
    example: ['Tháng', 'Tuần', 'Ngày', 'Giờ', 'Ca'],
    description: 'Các lựa chọn (chỉ dùng khi type=select)',
    required: false,
  })
  @IsArray()
  @IsOptional()
  options?: string[];

  @ApiProperty({
    example: true,
    required: false,
    description: 'Bắt buộc nhập khi fill contract',
  })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiProperty({
    example: '10.000.000 VNĐ',
    description: 'Giá trị mặc định (nếu có)',
    required: false,
  })
  @IsString()
  @IsOptional()
  defaultValue?: string;

  @ApiProperty({
    example: '10.000.000 VNĐ/tháng',
    description: 'Ví dụ giá trị để manager biết format',
    required: false,
  })
  @IsString()
  @IsOptional()
  exampleValue?: string;
}

export class CreateContractTemplateDto {
  @ApiProperty({ example: 'Hợp đồng Full-time' })
  @IsString()
  templateName: string;

  @ApiProperty({ example: 'FULL_TIME', required: false })
  @IsString()
  @IsOptional()
  templateType?: string;

  @ApiProperty({
    example: 'https://bucket.s3.amazonaws.com/contracts/template-1.pdf',
    description: 'URL file template đã upload lên storage',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiProperty({ example: 'pdf', enum: ['pdf', 'docx'], required: false })
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiProperty({
    example: '<p>Hợp đồng lao động ...</p>',
    description: 'HTML content từ rich text editor',
    required: false,
  })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiProperty({
    type: [TemplateFieldDto],
    description: 'Danh sách placeholder fields cần fill khi tạo hợp đồng',
    required: false,
  })
  @IsArray()
  @IsOptional()
  fields?: TemplateFieldDto[];

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateContractTemplateDto extends PartialType(
  CreateContractTemplateDto,
) {}

export class ContractTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty()
  templateName: string;

  @ApiProperty({ required: false })
  templateType: string;

  @ApiProperty({ required: false })
  fileUrl: string;

  @ApiProperty({ required: false })
  fileType: string;

  @ApiProperty({ required: false })
  contentHtml: string;

  @ApiProperty({ type: [TemplateFieldDto], required: false })
  fields: TemplateFieldDto[];

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
