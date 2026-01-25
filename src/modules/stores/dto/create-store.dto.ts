import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: 'Tên cửa hàng', example: 'TimeSO Coffee' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Ảnh đại diện cửa hàng', 
    type: 'string',
    format: 'binary',
    required: false 
  })
  @IsOptional()
  avatar?: any;

  @ApiProperty({ description: 'Thành phố', example: 'Hà Nội', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Phường/Xã', example: 'Phường Dịch Vọng', required: false })
  @IsString()
  @IsOptional()
  ward?: string;

  @ApiProperty({
    description: 'Địa chỉ chi tiết',
    example: '123 Đường ABC',
  })
  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @ApiProperty({ description: 'Mã số thuế', example: '0101234567', required: false })
  @IsString()
  @IsOptional()
  taxCode?: string;

  @ApiProperty({ description: 'Số điện thoại cửa hàng', example: '0241234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Email cửa hàng',
    example: 'contact@timeso.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Ngành hàng', example: 'F&B', required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ description: 'Quy mô nhân viên', example: '10-20', required: false })
  @IsString()
  @IsOptional()
  employeeRangeLabel?: string;

  @ApiProperty({ description: 'Năm hoạt động', example: '3-5 năm', required: false })
  @IsString()
  @IsOptional()
  yearsActiveLabel?: string;
}
