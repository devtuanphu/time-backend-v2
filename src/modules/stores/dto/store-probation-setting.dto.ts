import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsArray } from 'class-validator';

export class StoreProbationSettingDto {
  @ApiProperty({ description: 'Số ngày thử việc', example: 30 })
  @IsNumber()
  @IsOptional()
  probationDays?: number;

  @ApiProperty({ description: 'Số ca thử việc', example: 0 })
  @IsNumber()
  @IsOptional()
  probationShifts?: number;

  @ApiProperty({ description: 'Thông báo nhắc nhở đánh giá', example: true })
  @IsBoolean()
  @IsOptional()
  notifyEvaluation?: boolean;

  @ApiProperty({ description: 'Thông báo kết quả cho nhân viên', example: true })
  @IsBoolean()
  @IsOptional()
  notifyResultToEmployee?: boolean;

  @ApiProperty({ description: 'Tự động đóng checklist', example: false })
  @IsBoolean()
  @IsOptional()
  autoCloseChecklist?: boolean;

  @ApiProperty({ description: 'Tiêu chí chuyên cần (JSON)', example: [] })
  @IsArray()
  @IsOptional()
  attendanceChecklist?: any[];

  @ApiProperty({ description: 'Tiêu chí thái độ/kỹ năng (JSON)', example: [] })
  @IsArray()
  @IsOptional()
  attitudeChecklist?: any[];

  @ApiProperty({ description: 'Bật thưởng khi hoàn thành thử việc', example: false })
  @IsBoolean()
  @IsOptional()
  enableCompletionBonus?: boolean;

  @ApiProperty({ description: 'Mức thưởng hoàn thành', example: 500000 })
  @IsNumber()
  @IsOptional()
  completionBonus?: number;
}
