import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class InternalRuleFileDto {
  @ApiProperty({ example: 'noi-quy-2025.pdf' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://example.com/file.pdf' })
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  size?: number;
}

export class UpdateInternalRuleDto {
  @ApiPropertyOptional({ example: 'Nội quy làm việc 2025' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: '<p>Nội dung nội quy...</p>' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Danh sách các file hiện có (giữ lại các file không bị thay đổi)',
    type: [InternalRuleFileDto],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InternalRuleFileDto)
  existingFiles?: InternalRuleFileDto[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isRequiredView?: boolean;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files?: any[];
}

export class InternalRuleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  storeId: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  content?: string;

  @ApiProperty({ type: [InternalRuleFileDto] })
  files: InternalRuleFileDto[];

  @ApiProperty()
  isRequiredView: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
