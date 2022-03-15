import { ApiProperty } from '@nestjs/swagger';

export class CreateSportDto {
  @ApiProperty({
    example: 'Futebol',
  })
  title: string;

  @ApiProperty({
    example: true,
  })
  visible?: boolean;
}
