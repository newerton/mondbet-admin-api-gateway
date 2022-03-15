import { ApiProperty } from '@nestjs/swagger';
import { ProfileLimitTypeRole } from '../entities/profile-limit.entity';
import { CreateProfileLimitDto } from './create-profile-limit.dto';

export class CreateProfileDto {
  @ApiProperty({
    example: `Perfil - ${new Date().toISOString()}`,
  })
  readonly title: string;

  @ApiProperty({
    example: null,
  })
  readonly sport_id: string;

  @ApiProperty({
    example: 0,
  })
  readonly combined: number;

  @ApiProperty({
    example: true,
  })
  readonly visible: boolean;

  @ApiProperty()
  readonly limit: CreateProfileLimitDto;
}
