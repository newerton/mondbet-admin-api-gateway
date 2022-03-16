import { ApiProperty } from '@nestjs/swagger';
import { CreateManagerAddressDto } from './create-manager-address.dto';
import { CreateManagerLimitDto } from './create-manager-limit.dto';

export class CreateManagerDto {
  @ApiProperty({
    example: null,
  })
  readonly profile_id: string;

  @ApiProperty({
    example: null,
  })
  readonly manager_id?: string;

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
    example: false,
  })
  readonly permission_delete_ticket: boolean;

  @ApiProperty({
    example: true,
  })
  readonly visible: boolean;

  @ApiProperty()
  readonly address?: CreateManagerAddressDto;

  @ApiProperty()
  readonly limit: CreateManagerLimitDto;
}
