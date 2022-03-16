import { ApiProperty } from '@nestjs/swagger';

export class CreateManagerLimitDto {
  @ApiProperty({
    example: 500000.0,
  })
  general_limit: number;

  @ApiProperty({
    example: 100,
  })
  agent_max: number;

  @ApiProperty({
    example: 1001.0,
  })
  daily_limit_single_bet: number;

  @ApiProperty({
    example: 30000.0,
    description: 'Não requerido quando for Sub-Gerente',
  })
  weekly_limit_single_bet?: number;

  @ApiProperty({
    example: 5001.0,
  })
  daily_limit_double_bet: number;

  @ApiProperty({
    example: 5000.0,
  })
  daily_limit_triple_bet: number;
}
