import { IsEnum, IsArray, IsOptional, IsString, IsNumber, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentCycle,
  ApplicableEmployees,
  ConfigStatus,
} from '../entities/salary-config.entity';
import { PaymentType } from '../entities/employee-contract.entity';

class DailyConfigDto {
  @ApiProperty()
  @IsString()
  timesheetCloseTime: string;

  @ApiProperty()
  @IsString()
  paymentTime: string;

  @ApiProperty()
  @IsString()
  lockTime: string;
}

class WeeklyConfigDto {
  @ApiProperty()
  @IsNumber()
  timesheetCloseDay: number;

  @ApiProperty()
  @IsString()
  timesheetCloseTime: string;

  @ApiProperty()
  @IsNumber()
  paymentDay: number;

  @ApiProperty()
  @IsString()
  paymentTime: string;

  @ApiProperty()
  @IsNumber()
  lockDay: number;
}

class MonthlyConfigDto {
  @ApiProperty()
  @IsNumber()
  timesheetCloseDate: number;

  @ApiProperty()
  @IsString()
  timesheetCloseTime: string;

  @ApiProperty()
  @IsNumber()
  paymentDate: number;

  @ApiProperty()
  @IsString()
  paymentTime: string;

  @ApiProperty()
  @IsNumber()
  lockDate: number;
}

export class CreateSalaryConfigDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  storeIds: string[];

  @ApiProperty({ enum: PaymentCycle })
  @IsEnum(PaymentCycle)
  paymentCycle: PaymentCycle;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  applicablePaymentType: PaymentType;

  @ApiProperty({ enum: ApplicableEmployees })
  @IsEnum(ApplicableEmployees)
  applicableEmployees: ApplicableEmployees;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  employeeProfileIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => DailyConfigDto)
  dailyConfig?: DailyConfigDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => WeeklyConfigDto)
  weeklyConfig?: WeeklyConfigDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => MonthlyConfigDto)
  monthlyConfig?: MonthlyConfigDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: ConfigStatus })
  @IsOptional()
  @IsEnum(ConfigStatus)
  status?: ConfigStatus;
}

export class UpdateSalaryConfigDto extends CreateSalaryConfigDto {}

export class SalaryConfigResponseDto extends CreateSalaryConfigDto {
  @ApiProperty()
  id: string;
}
