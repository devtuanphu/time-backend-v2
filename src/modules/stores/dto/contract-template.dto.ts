import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { PaymentType } from '../entities/employee-contract.entity';

export class ContractTemplateTermDto {
  @ApiProperty({ example: 'Thời gian làm việc' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Nhân viên làm việc từ 8h00 đến 17h00 các ngày trong tuần',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateContractTemplateDto {
  @ApiProperty({ example: 'Hợp đồng Full-time' })
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiProperty({ example: 'FULL_TIME', required: false })
  @IsString()
  @IsOptional()
  templateType?: string;

  @ApiProperty({
    example:
      'Phục vụ khách hàng tại quán, pha chế đồ uống, vệ sinh khu vực làm việc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  jobDescription?: string;

  @ApiProperty({ example: 44, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  weeklyWorkingHours?: number;

  @ApiProperty({ example: '1 tháng', required: false })
  @IsString()
  @IsOptional()
  probationPeriod?: string;

  @ApiProperty({ example: 'Tháng', enum: PaymentType, required: false })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @ApiProperty({ example: 10000000, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  salaryAmount?: number;

  @ApiProperty({
    example: { 'Phụ cấp ăn trưa': 500000, 'Phụ cấp xăng': 200000 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  allowances?: Record<string, number>;

  @ApiProperty({ type: [ContractTemplateTermDto], required: false })
  @IsArray()
  @IsOptional()
  terms?: ContractTemplateTermDto[];

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
  jobDescription: string;

  @ApiProperty({ required: false })
  weeklyWorkingHours: number;

  @ApiProperty({ required: false })
  probationPeriod: string;

  @ApiProperty({ required: false })
  paymentType: PaymentType;

  @ApiProperty({ required: false })
  salaryAmount: number;

  @ApiProperty({ required: false })
  allowances: Record<string, number>;

  @ApiProperty({ type: [ContractTemplateTermDto], required: false })
  terms: ContractTemplateTermDto[];

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
