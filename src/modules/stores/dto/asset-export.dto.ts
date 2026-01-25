import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AssetExportItemDto {
  @ApiProperty({
    description: 'ID cửa hàng',
    example: 'uuid-store-1',
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    description: 'ID tài sản/hàng hóa',
    example: 'uuid-asset-1',
  })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({
    description: 'ID đơn vị tính',
    example: 'uuid-unit-1',
  })
  @IsString()
  @IsNotEmpty()
  assetUnitId: string;

  @ApiProperty({
    description: 'Ghi chú cho từng món',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Số lượng xuất',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'ID loại xuất kho',
    example: 'uuid-export-type-1',
  })
  @IsString()
  @IsNotEmpty()
  assetExportTypeId: string;

  @ApiProperty({
    description: 'Ngày xuất hàng (YYYY-MM-DD)',
    example: '2024-01-25',
  })
  @IsString()
  @IsNotEmpty()
  exportDate: string;
}

export class AssetExportDto {
  @ApiProperty({
    description: 'Danh sách món hàng cần xuất kho',
    type: [AssetExportItemDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetExportItemDto)
  items: AssetExportItemDto[];
}
