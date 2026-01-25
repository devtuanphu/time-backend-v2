import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductExportItemDto {
  @ApiProperty({
    description: 'ID cửa hàng',
    example: 'uuid-store-1',
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    description: 'ID hàng hóa',
    example: 'uuid-product-1',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'ID đơn vị tính',
    example: 'uuid-unit-1',
  })
  @IsString()
  @IsNotEmpty()
  productUnitId: string;

  @ApiProperty({
    description: 'Ghi chú cho từng món',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Số lượng xuất',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'ID loại xuất kho hàng hóa',
    example: 'uuid-export-type-1',
  })
  @IsString()
  @IsNotEmpty()
  productExportTypeId: string;

  @ApiProperty({
    description: 'Ngày xuất hàng (YYYY-MM-DD)',
    example: '2024-01-25',
  })
  @IsString()
  @IsNotEmpty()
  exportDate: string;
}

export class ProductExportDto {
  @ApiProperty({
    description: 'Danh sách món hàng hóa cần xuất kho',
    type: [ProductExportItemDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductExportItemDto)
  items: ProductExportItemDto[];
}

export class CreateProductExportTypeDto {
  @ApiProperty({ description: 'Tên loại xuất', example: 'Hủy bỏ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mã màu hiển thị', example: '#FF0000', required: false })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', example: true, default: true })
  @IsOptional()
  isActive?: boolean;
}
