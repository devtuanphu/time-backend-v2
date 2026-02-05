import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterFcmTokenDto {
  @ApiProperty({
    description: 'Firebase Cloud Messaging token for push notifications',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  @IsNotEmpty()
  @IsString()
  fcmToken: string;
}
