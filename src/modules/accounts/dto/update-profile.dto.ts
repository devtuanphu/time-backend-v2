import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateIdentityDto {
  @ApiProperty({
    description: 'Loại giấy tờ (CMND, CCCD, Passport)',
    example: 'CCCD',
  })
  @IsString()
  @IsNotEmpty()
  docType: string;

  @ApiProperty({ description: 'Số giấy tờ định danh', example: '012345678912' })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh mặt trước',
    required: false,
  })
  @IsOptional()
  frontImage?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh mặt sau',
    required: false,
  })
  @IsOptional()
  backImage?: any;
}

export class UpdateFinanceDto {
  @ApiProperty({ description: 'Tên ngân hàng', example: 'Vietcombank' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ description: 'Số tài khoản ngân hàng', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  bankNumber: string;

  @ApiProperty({ description: 'Tên chủ tài khoản', example: 'NGUYEN VAN A' })
  @IsString()
  @IsOptional()
  bankAccountHolder?: string;

  @ApiProperty({
    description: 'Mã số thuế',
    example: '0123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  taxCode?: string;
}
