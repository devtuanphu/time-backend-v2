import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Mã tài sản (SKU/Code)',
    example: 'ASSET-001',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Tên tài sản/công cụ',
    example: 'Máy pha cafe Nuova',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID đơn vị tính',
    example: 'uuid-unit',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  assetUnitId: string;

  @ApiProperty({
    description: 'Giá trị (Nguyên giá)',
    example: 50000000,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    description: 'Ghi chú',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Số lượng tồn đầu kỳ',
    example: 1,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  currentStock?: number;

  // --- Advanced Settings ---

  @ApiProperty({
    description: 'ID Nhân viên phụ trách',
    required: false,
  })
  @IsString()
  @IsOptional()
  responsibleEmployeeId?: string;

  @ApiProperty({
    description: 'ID danh mục tài sản',
    required: false,
  })
  @IsString()
  @IsOptional()
  assetCategoryId?: string;

  @ApiProperty({
    description: 'ID trạng thái tài sản',
    required: false,
  })
  @IsString()
  @IsOptional()
  assetStatusId?: string;

  @ApiProperty({
    description: 'Ngày mua (YYYY-MM-DD)',
    required: false,
  })
  @IsString()
  @IsOptional()
  purchaseDate?: string;

  @ApiProperty({
    description: 'Ngưỡng tồn kho tối thiểu',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minStock?: number;

  @ApiProperty({
    description: 'Ngưỡng tồn kho tối đa',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxStock?: number;

  @ApiProperty({
    description: 'Tên nhà cung cấp',
    required: false,
  })
  @IsString()
  @IsOptional()
  supplierName?: string;

  @ApiProperty({
    description: 'SĐT nhà cung cấp',
    required: false,
  })
  @IsString()
  @IsOptional()
  supplierPhone?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh tài sản',
    required: false,
  })
  @IsOptional()
  avatar?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh hóa đơn',
    required: false,
  })
  @IsOptional()
  invoiceFile?: any;
}
