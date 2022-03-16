import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentLimitDto {
  @ApiProperty({
    example: 500000.0,
  })
  general_limit: number;

  @ApiProperty({
    example: 12,
  })
  reward_percentage: number;

  @ApiProperty({
    example: 1001.0,
  })
  daily_limit_single_bet: number;

  @ApiProperty({
    example: 5001.0,
  })
  daily_limit_double_bet: number;

  @ApiProperty({
    example: 5000.0,
  })
  daily_limit_triple_bet: number;
}
