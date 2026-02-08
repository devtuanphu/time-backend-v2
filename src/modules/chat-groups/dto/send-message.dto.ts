import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: 'ID nhóm chat' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ description: 'Nội dung tin nhắn' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Loại tin nhắn',
    enum: ['text', 'image', 'file'],
  })
  @IsEnum(['text', 'image', 'file'])
  @IsOptional()
  messageType?: string;

  @ApiPropertyOptional({ description: 'URL file đính kèm' })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @ApiPropertyOptional({ description: 'Tên file đính kèm' })
  @IsString()
  @IsOptional()
  attachmentName?: string;

  @ApiPropertyOptional({ description: 'Kích thước file (bytes)' })
  @IsOptional()
  attachmentSize?: number;
}
