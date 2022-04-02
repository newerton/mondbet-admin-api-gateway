import { ApiProperty } from '@nestjs/swagger';
import { CreateManagerAddressDto } from './create-manager-address.dto';
import { CreateManagerLimitDto } from './create-manager-limit.dto';
import { CreateManagerRoleDto } from './create-manager-role.dto';

export class CreateManagerDto {
  @ApiProperty({
    example: null,
  })
  profile_id: string;

  @ApiProperty({
    example: null,
  })
  manager_id?: string;

  @ApiProperty({
    example: 'Newerton',
  })
  first_name: string;

  @ApiProperty({
    example: 'Vargas de Araujo',
  })
  last_name: string;

  @ApiProperty({
    example: 'newerton.araujo@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '123456',
  })
  password: string;

  @ApiProperty({
    example: '123456',
  })
  repeat_password: string;

  @ApiProperty({
    example: null,
  })
  document?: string;

  @ApiProperty({
    example: null,
  })
  birthday?: string;

  @ApiProperty({
    example: null,
  })
  phone?: string;

  @ApiProperty({
    example: false,
  })
  permission_delete_ticket: boolean;

  @ApiProperty({
    example: true,
  })
  visible: boolean;

  @ApiProperty()
  address?: CreateManagerAddressDto;

  @ApiProperty()
  limit: CreateManagerLimitDto;

  @ApiProperty()
  roles?: CreateManagerRoleDto[];
}
