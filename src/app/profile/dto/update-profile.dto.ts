import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty({
    example: `Perfil - ${new Date().toISOString()}`,
  })
  readonly title: string;
}
