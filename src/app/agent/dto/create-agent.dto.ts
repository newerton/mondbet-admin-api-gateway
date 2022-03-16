import { ApiProperty } from '@nestjs/swagger';
import { CreateAgentAddressDto } from './create-agent-address.dto';
import { CreateAgentLimitDto } from './create-agent-limit.dto';

export class CreateAgentDto {
  @ApiProperty({
    example: null,
  })
  readonly profile_id: string;

  @ApiProperty({
    example: null,
  })
  manager_id: string;

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
    example: null,
  })
  readonly description?: string;

  @ApiProperty({
    example: true,
  })
  readonly visible: boolean;

  @ApiProperty()
  readonly address?: CreateAgentAddressDto;

  @ApiProperty()
  readonly limit: CreateAgentLimitDto;
}
