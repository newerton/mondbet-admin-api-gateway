import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCollectDto } from './create-collect.dto';

export class UpdateCollectDto extends PartialType(
  OmitType(CreateCollectDto, ['email'] as const),
) {
  email: string;
}
