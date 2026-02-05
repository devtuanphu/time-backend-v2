import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPushNotificationDto {
  @ApiProperty({ 
    example: 'user-id-123',
    description: 'ID của user nhận notification' 
  })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ 
    example: 'Thông báo mới',
    description: 'Tiêu đề notification' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'Bạn có ca làm việc mới',
    description: 'Nội dung notification' 
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ 
    example: { screen: '/(tabs)/manager', shiftId: '123' },
    description: 'Data tùy chỉnh (optional)',
    required: false
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
