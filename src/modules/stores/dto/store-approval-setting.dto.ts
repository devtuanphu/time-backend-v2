import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class StoreApprovalSettingDto {
  @ApiProperty({ description: 'Bật đăng ký ca', example: true })
  @IsBoolean()
  @IsOptional()
  enableShiftRegistration?: boolean;

  @ApiProperty({ description: 'Bật xin nghỉ/đi trễ', example: true })
  @IsBoolean()
  @IsOptional()
  enableLeaveRequest?: boolean;

  @ApiProperty({ description: 'Bật đổi ca', example: true })
  @IsBoolean()
  @IsOptional()
  enableShiftSwap?: boolean;

  @ApiProperty({ description: 'ID người phê duyệt chính', nullable: true })
  @IsString()
  @IsOptional()
  primaryApproverId?: string;

  @ApiProperty({ description: 'ID người phê duyệt thay thế', nullable: true })
  @IsString()
  @IsOptional()
  backupApproverId?: string;

  @ApiProperty({ description: 'Giờ báo trước xin nghỉ', example: 24 })
  @IsNumber()
  @IsOptional()
  leaveNoticeHours?: number;

  @ApiProperty({ description: 'Số lần xin nghỉ tối đa/tháng', example: 2 })
  @IsNumber()
  @IsOptional()
  leaveLimitPerMonth?: number;

  @ApiProperty({ description: 'Giờ báo trước đổi ca', example: 12 })
  @IsNumber()
  @IsOptional()
  swapNoticeHours?: number;

  @ApiProperty({ description: 'Số lần đổi ca tối đa/tháng', example: 2 })
  @IsNumber()
  @IsOptional()
  swapLimitPerMonth?: number;

  @ApiProperty({ description: 'Giờ báo trước đi trễ/về sớm', example: 2 })
  @IsNumber()
  @IsOptional()
  lateEarlyNoticeHours?: number;

  @ApiProperty({ description: 'Số lần đi trễ tối đa/tháng', example: 2 })
  @IsNumber()
  @IsOptional()
  lateEarlyLimitPerMonth?: number;

  @ApiProperty({ description: 'Giờ mở đăng ký ca', example: '08:00' })
  @IsString()
  @IsOptional()
  shiftRegisterOpenTime?: string;

  @ApiProperty({ description: 'Ngày mở đăng ký ca', example: 'Monday' })
  @IsString()
  @IsOptional()
  shiftRegisterOpenDay?: string;

  @ApiProperty({ description: 'Giờ đóng đăng ký ca', example: '00:00' })
  @IsString()
  @IsOptional()
  shiftRegisterCloseTime?: string;

  @ApiProperty({ description: 'Ngày đóng đăng ký ca', example: 'Thursday' })
  @IsString()
  @IsOptional()
  shiftRegisterCloseDay?: string;

  @ApiProperty({ description: 'Giờ cảnh báo thiếu người', example: 24 })
  @IsNumber()
  @IsOptional()
  personnelWarningHours?: number;
}
