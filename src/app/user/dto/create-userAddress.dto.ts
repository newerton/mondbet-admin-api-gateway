import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({
    example: '04538-133',
  })
  readonly zipcode: string;

  @ApiProperty({
    example: 'Av. Brigadeiro Faria Lima',
  })
  readonly street: string;

  @ApiProperty({
    example: '3477',
  })
  readonly number: string;

  @ApiProperty({
    example: 'Itaim Bibi',
  })
  readonly neighborhood: string;

  @ApiProperty({
    example: null,
  })
  readonly complement?: string;

  @ApiProperty({
    example: '',
  })
  readonly state_id: string;

  @ApiProperty({
    example: '',
  })
  readonly city_id: string;
}
