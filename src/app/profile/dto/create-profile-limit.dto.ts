import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileLimitDto {
  @ApiProperty({ example: 500.0 })
  bet_max: number;

  @ApiProperty({ example: 500.0 })
  bet_max_multiple: number;

  @ApiProperty({ example: 0 })
  bet_max_event: number;

  @ApiProperty({ example: 10000.0 })
  bet_max_win: number;

  @ApiProperty({ example: 10000.0 })
  bet_max_multiple_win: number;

  @ApiProperty({ example: 1.02 })
  bet_min: number;

  @ApiProperty({ example: 3.02 })
  bet_min_multiple: number;

  @ApiProperty({ example: 2.2 })
  quote_min_ticket: number;
}
