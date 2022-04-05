import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentRoleDto {
  @ApiProperty({
    example: 'Recolhe',
  })
  title: string;

  @ApiProperty({
    example: 'Agent',
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
