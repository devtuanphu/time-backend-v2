import { IsEnum, IsNumber, IsDateString, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdjustmentType, SalaryChangeType } from '../entities/salary-adjustment.entity';
import { PaymentType } from '../entities/employee-contract.entity';

export class CreateSalaryAdjustmentDto {
  @ApiProperty()
  @IsUUID()
  employeeProfileId: string;

  @ApiProperty({ enum: AdjustmentType })
  @IsEnum(AdjustmentType)
  adjustmentType: AdjustmentType;

  @ApiProperty({ enum: SalaryChangeType })
  @IsEnum(SalaryChangeType)
  changeType: SalaryChangeType;

  @ApiProperty({ description: 'Giá trị nhập vào (số tiền hoặc %)' })
  @IsNumber()
  amountValue: number;

  @ApiProperty({ description: 'Tháng hiệu lực (YYYY-MM-01)' })
  @IsDateString()
  effectiveMonth: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reasonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reasonText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SalaryAdjustmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeProfileId: string;

  @ApiProperty({ enum: AdjustmentType })
  adjustmentType: AdjustmentType;

  @ApiProperty({ enum: SalaryChangeType })
  changeType: SalaryChangeType;

  @ApiProperty()
  previousSalary: number;

  @ApiProperty()
  amountValue: number;

  @ApiProperty()
  adjustmentAmount: number;

  @ApiProperty()
  newSalary: number;

  @ApiProperty()
  effectiveMonth: Date;

  @ApiProperty()
  reasonText: string;

  @ApiProperty()
  createdAt: Date;
}
