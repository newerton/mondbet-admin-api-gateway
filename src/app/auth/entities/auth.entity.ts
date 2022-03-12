import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  @ApiProperty()
  access_token: string;
}
