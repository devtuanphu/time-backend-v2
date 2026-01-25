import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
  refresh_token: string;

  @ApiProperty()
  user: any;
}

export class AuthMessageDto {
  @ApiProperty({ example: 'Thao tác thành công' })
  message: string;
}
