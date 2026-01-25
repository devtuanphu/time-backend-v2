import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsArray, IsString } from 'class-validator';

export class StoreTimekeepingSettingDto {
  @ApiProperty({ description: 'Bật ca linh hoạt', example: false })
  @IsBoolean()
  @IsOptional()
  enableFlexibleShift?: boolean;

  @ApiProperty({ description: 'Bắt buộc có vị trí khi chấm công', example: true })
  @IsBoolean()
  @IsOptional()
  requireLocation?: boolean;

  @ApiProperty({ description: 'Danh sách ID nhân viên miễn trừ yêu cầu vị trí', example: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  locationExceptionEmployeeIds?: string[];

  @ApiProperty({ description: 'Số phút cho phép đi muộn/về sớm', example: 15 })
  @IsNumber()
  @IsOptional()
  allowedLateMinutes?: number;

  @ApiProperty({ description: 'Trừ giờ công nếu vượt quá', example: true })
  @IsBoolean()
  @IsOptional()
  deductWorkTimeIfLate?: boolean;

  @ApiProperty({ description: 'Hiển thị cảnh báo đi muộn', example: true })
  @IsBoolean()
  @IsOptional()
  showLateAlert?: boolean;

  @ApiProperty({ description: 'Tính đủ công dù đi muộn/về sớm', example: false })
  @IsBoolean()
  @IsOptional()
  countFullTimeIfLate?: boolean;

  @ApiProperty({ description: 'Cho phép check-in trước giờ làm (phút)', example: 15 })
  @IsNumber()
  @IsOptional()
  earlyCheckinMinutes?: number;

  @ApiProperty({ description: 'Cho phép check-out sau giờ làm (phút)', example: 15 })
  @IsNumber()
  @IsOptional()
  lateCheckoutMinutes?: number;

  @ApiProperty({ description: 'Bật tính lương phụ trội làm thêm giờ', example: false })
  @IsBoolean()
  @IsOptional()
  enableOvertimeMultiplier?: boolean;

  @ApiProperty({ description: 'Hệ số lương làm thêm giờ', example: 1.5 })
  @IsNumber()
  @IsOptional()
  overtimeMultiplier?: number;

  @ApiProperty({ description: 'Nhắc nhở khi gần trễ ca', example: false })
  @IsBoolean()
  @IsOptional()
  notifyLateShift?: boolean;

  @ApiProperty({ description: 'Danh sách ca làm việc' })
  @IsOptional()
  shifts?: any[]; // StoreWorkShiftDto[] - Define properly if possible, or use any for now
}

export class StoreWorkShiftDto {
  @ApiProperty() @IsString() @IsOptional() id?: string;
  @ApiProperty() @IsString() @IsOptional() shiftName: string;
  @ApiProperty() @IsString() @IsOptional() startTime: string;
  @ApiProperty() @IsString() @IsOptional() endTime: string;
  @ApiProperty() @IsBoolean() @IsOptional() isActive: boolean;
}

