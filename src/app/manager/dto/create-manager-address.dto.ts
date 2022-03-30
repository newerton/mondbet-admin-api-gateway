import { ApiProperty } from '@nestjs/swagger';

export class CreateManagerAddressDto {
  @ApiProperty({
    example: '04538-133',
  })
  zipcode: string;

  @ApiProperty({
    example: 'Av. Brigadeiro Faria Lima',
  })
  street: string;

  @ApiProperty({
    example: '3477',
  })
  number: string;

  @ApiProperty({
    example: 'Itaim Bibi',
  })
  neighborhood: string;

  @ApiProperty({
    example: null,
  })
  complement?: string;

  @ApiProperty({
    example: '',
  })
  state_id: string;

  @ApiProperty({
    example: '',
  })
  city_id: string;
}
