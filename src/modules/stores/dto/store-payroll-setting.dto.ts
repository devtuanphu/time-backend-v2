
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PayrollCalculationMethod } from '../entities/store-payroll-setting.entity';
import { PayrollCalcType, PayrollRuleCategory } from '../entities/store-payroll-rule.entity';
import { IncrementRuleType } from '../entities/store-payroll-increment-rule.entity';

// I put some enums in different files. Let's move them to a central place or just redo imports.
// Actually, I put PayrollCalculationMethod in store-payroll-setting.entity.ts. 
// I put PayrollRuleCategory and PayrollCalcType in store-payroll-rule.entity.ts.
// I put IncrementRuleType in store-payroll-increment-rule.entity.ts.

export class PayrollRuleDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() ruleType: string;
  @ApiProperty({ enum: ['amount', 'percentage', 'shift'] }) @IsEnum(['amount', 'percentage', 'shift']) calcType: string;
  @ApiProperty() @IsNumber() value: number;
}

export class IncrementRuleDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() id?: string;
  @ApiProperty({ enum: ['periodic', 'seniority'] }) @IsEnum(['periodic', 'seniority']) type: string;
  @ApiProperty() @IsString() conditionType: string;
  @ApiProperty() @IsString() conditionValue: string;
  @ApiProperty({ enum: ['amount', 'percentage', 'shift'] }) @IsEnum(['amount', 'percentage', 'shift']) calcType: string;
  @ApiProperty() @IsNumber() value: number;
}

export class RolePayrollDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() coefficient: number;
  @ApiProperty() @IsNumber() allowance: number;
}

export class UpdatePayrollSettingDto {
  @ApiProperty({ enum: ['hour', 'shift', 'day', 'month', 'flexible'] }) @IsOptional() @IsString() calculationMethod?: string;
  @ApiProperty() @IsOptional() @IsString() priorityCalcType?: string;
  @ApiProperty() @IsOptional() @IsNumber() priorityCalcValue?: number;
  @ApiProperty() @IsOptional() @IsString() alternativeCalcType?: string;
  @ApiProperty() @IsOptional() @IsNumber() alternativeCalcValue?: number;

  @ApiProperty({ type: [PayrollRuleDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PayrollRuleDto) bonuses?: PayrollRuleDto[];
  @ApiProperty({ type: [PayrollRuleDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PayrollRuleDto) fines?: PayrollRuleDto[];
  @ApiProperty({ type: [PayrollRuleDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PayrollRuleDto) benefits?: PayrollRuleDto[];
  @ApiProperty({ type: [IncrementRuleDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => IncrementRuleDto) incrementRules?: IncrementRuleDto[];
  @ApiProperty({ type: [RolePayrollDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => RolePayrollDto) roles?: RolePayrollDto[];
}
