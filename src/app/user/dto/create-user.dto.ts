import { ApiProperty } from '@nestjs/swagger';
import { CreateUserAddressDto } from './create-userAddress.dto';

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
    example: null,
  })
  readonly document?: string;

  @ApiProperty({
    example: null,
  })
  readonly birthday?: string;

  @ApiProperty({
    example: null,
  })
  readonly phone?: string;

  @ApiProperty({
    example: true,
  })
  readonly visible: boolean;

  @ApiProperty()
  readonly address?: CreateUserAddressDto;
}
