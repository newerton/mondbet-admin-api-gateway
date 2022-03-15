import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  ParseUUIDPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt-auth.guard';
import { Payload } from '@nestjs/microservices';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { HeadersPaginationInterceptor } from 'src/common/interceptors/headers-pagination.interceptors';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { ProfileCreateSchema } from './validations/profile-create.schema.validation';
import { ProfileUpdateSchema } from './validations/profile-update.schema.validation';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create profile' })
  @ApiCreatedResponse({ description: 'Not content' })
  create(
    @Payload(new JoiValidationPipe(new ProfileCreateSchema()))
    payload: CreateProfileDto,
  ) {
    return this.service.create(payload);
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all profiles' })
  @ApiOkResponse({ description: 'List all profiles', type: Profile })
  @UseInterceptors(HeadersPaginationInterceptor)
  async findAll(@Query() query): Promise<any> {
    const { data, cursor } = await this.service.findAll(query);
    return { data, cursor };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one profile by ID' })
  @ApiOkResponse({ description: 'Profile object', type: Profile })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<Profile | undefined> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a profile' })
  @ApiNoContentResponse({ description: 'No content' })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Payload(new JoiValidationPipe(new ProfileUpdateSchema()))
    payload: UpdateProfileDto,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a profile' })
  @ApiNoContentResponse({ description: 'No content' })
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return this.service.remove(id);
  }
}
