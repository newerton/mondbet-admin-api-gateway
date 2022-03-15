import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSportDto } from './create-sport.dto';

export class UpdateSportDto extends PartialType(CreateSportDto) {
  @ApiProperty({
    example: 'Futebol',
  })
  title: string;

  @ApiProperty({
    example: true,
  })
  visible?: boolean;
}
