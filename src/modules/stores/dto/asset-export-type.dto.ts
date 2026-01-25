import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateAssetExportTypeDto {
  @ApiProperty({
    description: 'Tên loại xuất kho',
    example: 'Thanh lý',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Mã màu hiển thị',
    example: '#FF0000',
    required: false,
  })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
