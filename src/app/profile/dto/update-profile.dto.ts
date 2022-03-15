import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';
import { UpdateProfileLimitDto } from './update-profile-limit.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
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
  readonly limit: UpdateProfileLimitDto;
}
