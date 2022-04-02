import { ApiProperty } from '@nestjs/swagger';

export class CreateManagerRoleDto {
  @ApiProperty({
    example: 'Supervisor',
  })
  title: string;

  @ApiProperty({
    example: 'Manager',
  })
  resource: string;

  @ApiProperty({
    example: true,
  })
  create: boolean;

  @ApiProperty({
    example: true,
  })
  read: boolean;

  @ApiProperty({
    example: true,
  })
  update: boolean;
}
