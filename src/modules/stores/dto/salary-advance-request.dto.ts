import { IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdvanceRequestStatus } from '../entities/salary-advance-request.entity';

export class CreateSalaryAdvanceRequestDto {
  @ApiProperty({ description: 'ID của phiếu lương tháng hiện tại' })
  @IsString()
  employeeSalaryId: string;

  @ApiProperty({ description: 'Số tiền muốn ứng', example: 5000000 })
  @IsNumber()
  @Min(0)
  requestedAmount: number;

  @ApiPropertyOptional({ description: 'Lý do ứng lương' })
  @IsOptional()
  @IsString()
  requestReason?: string;
}

export class ReviewSalaryAdvanceRequestDto {
  @ApiProperty({ enum: AdvanceRequestStatus, description: 'Trạng thái duyệt' })
  @IsEnum(AdvanceRequestStatus)
  status: AdvanceRequestStatus;

  @ApiPropertyOptional({ description: 'Số tiền được duyệt (nếu khác với số tiền yêu cầu)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  approvedAmount?: number;

  @ApiPropertyOptional({ description: 'Ghi chú của người duyệt' })
  @IsOptional()
  @IsString()
  reviewNote?: string;

  @ApiPropertyOptional({ description: 'Phương thức thanh toán' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Mã tham chiếu giao dịch' })
  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class SalaryAdvanceRequestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeProfileId: string;

  @ApiProperty()
  employeeSalaryId: string;

  @ApiProperty()
  requestedAmount: number;

  @ApiPropertyOptional()
  approvedAmount?: number;

  @ApiPropertyOptional()
  requestReason?: string;

  @ApiProperty({ enum: AdvanceRequestStatus })
  status: AdvanceRequestStatus;

  @ApiProperty()
  requestedAt: Date;

  @ApiPropertyOptional()
  reviewedAt?: Date;

  @ApiPropertyOptional()
  reviewedByAccountId?: string;

  @ApiPropertyOptional()
  reviewNote?: string;

  @ApiPropertyOptional()
  paymentMethod?: string;

  @ApiPropertyOptional()
  paymentReference?: string;
}
