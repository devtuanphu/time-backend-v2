import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StopWorkCycleDto {
  @ApiPropertyOptional({ 
    description: 'Dừng ngay lập tức. Mặc định là true. Nếu false, cần truyền scheduledStopAt.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  stopImmediately?: boolean;

  @ApiPropertyOptional({ 
    description: 'Thời điểm hẹn dừng (ISO date). Chỉ dùng khi stopImmediately = false.',
    example: '2026-02-15T00:00:00.000Z',
  })
  @ValidateIf(o => o.stopImmediately === false)
  @IsString()
  scheduledStopAt?: string;
}
