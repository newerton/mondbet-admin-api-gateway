import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateManagerDto } from './create-manager.dto';

export class UpdateManagerDto extends PartialType(
  OmitType(CreateManagerDto, ['email'] as const),
) {
  email: string;
}
