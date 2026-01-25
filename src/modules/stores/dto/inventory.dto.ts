import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';



export class CreateProductDto {
  @ApiProperty({
    description: 'Tên nguyên liệu/sản phẩm',
    example: 'Hạt Cafe Arabica',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mã SKU', example: 'PROD-001', required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'ID danh mục sản phẩm',
    example: 'uuid-category',
  })
  @IsString()
  @IsNotEmpty()
  productCategoryId: string;

  @ApiProperty({
    description: 'ID trạng thái sản phẩm',
    example: 'uuid-status',
  })
  @IsString()
  @IsNotEmpty()
  productStatusId: string;

  @ApiProperty({ description: 'ID đơn vị tính', example: 'uuid-unit' })
  @IsString()
  @IsNotEmpty()
  productUnitId: string;

  @ApiProperty({ description: 'Giá vốn (Cost Price)', example: 150000 })
  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @ApiProperty({
    description: 'Giá bán (Selling Price)',
    example: 350000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sellingPrice?: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh sản phẩm',
    required: false,
  })
  @IsOptional()
  avatar?: any;
}
