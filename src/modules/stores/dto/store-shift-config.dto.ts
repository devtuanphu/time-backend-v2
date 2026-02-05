import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WeekDay, TimekeepingRequirement } from '../entities/store-shift-config.entity';

export class CreateStoreShiftConfigDto {
  @ApiProperty({ description: 'Store ID' })
  @IsUUID()
  storeId: string;

  @ApiPropertyOptional({
    description: 'Ngày được nghỉ trong tuần',
    enum: WeekDay,
    isArray: true,
    example: ['SATURDAY', 'SUNDAY'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  daysOff?: WeekDay[];

  @ApiPropertyOptional({
    description: 'Không duyệt nghỉ vào các ngày này',
    enum: WeekDay,
    isArray: true,
    example: ['SATURDAY', 'SUNDAY'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  noApprovalDays?: WeekDay[];

  @ApiPropertyOptional({
    description: 'Điểm danh yêu cầu',
    enum: TimekeepingRequirement,
    example: 'LOCATION_QR_GPS_FACEID',
  })
  @IsOptional()
  @IsEnum(TimekeepingRequirement)
  timekeepingRequirement?: TimekeepingRequirement;
}

export class UpdateStoreShiftConfigDto {
  @ApiPropertyOptional({
    description: 'Ngày được nghỉ trong tuần',
    enum: WeekDay,
    isArray: true,
    example: ['SATURDAY', 'SUNDAY'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  daysOff?: WeekDay[];

  @ApiPropertyOptional({
    description: 'Không duyệt nghỉ vào các ngày này',
    enum: WeekDay,
    isArray: true,
    example: ['SATURDAY', 'SUNDAY'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  noApprovalDays?: WeekDay[];

  @ApiPropertyOptional({
    description: 'Điểm danh yêu cầu',
    enum: TimekeepingRequirement,
    example: 'LOCATION_QR_GPS_FACEID',
  })
  @IsOptional()
  @IsEnum(TimekeepingRequirement)
  timekeepingRequirement?: TimekeepingRequirement;
}
