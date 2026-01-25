import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, Min, IsArray } from 'class-validator';
import { AssetAssignmentStatus } from '../entities/employee-asset-assignment.entity';

export class AssignAssetDto {
  @ApiProperty({ example: 'asset-uuid-here' })
  @IsString()
  assetId: string;

  @ApiProperty({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false, example: '2026-12-31' })
  @IsOptional()
  dueDate?: Date;
}

export class BulkAssignAssetsDto {
  @ApiProperty({ type: [String], example: ['asset-id-1', 'asset-id-2'] })
  @IsArray()
  @IsString({ each: true })
  assetIds: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false, example: '2026-12-31' })
  @IsOptional()
  dueDate?: Date;
}

export class ReturnAssetDto {
  @ApiProperty({ example: 'RETURNED', enum: AssetAssignmentStatus })
  @IsEnum(AssetAssignmentStatus)
  status: AssetAssignmentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  returnNote?: string;
}

export class ExchangeAssetDto {
  @ApiProperty({ example: 'new-asset-uuid' })
  @IsString()
  newAssetId: string;

  @ApiProperty({ example: 1, default: 1 })
  @IsOptional()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false, example: '2026-12-31' })
  @IsOptional()
  dueDate?: Date;
}

export class ReassignAssetDto {
  @ApiProperty({ example: 1, default: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ required: false, example: '2026-12-31' })
  @IsOptional()
  dueDate?: Date;
}
