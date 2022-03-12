import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Newerton',
  })
  readonly first_name: string;

  @ApiProperty({
    example: 'Vargas de Araujo',
  })
  readonly last_name: string;

  @ApiProperty({
    example: 'newerton.araujo@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    example: '123456',
  })
  readonly password: string;

  @ApiProperty({
    example: '123456',
  })
  readonly repeat_password: string;

  @ApiProperty({
    example: true,
  })
  readonly visible: boolean;
}
