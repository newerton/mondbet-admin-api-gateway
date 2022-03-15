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
} from '@nestjs/common';
import { SportService } from './sport.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
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
import { Sport } from './entities/sport.entity';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { SportCreateSchema } from './validations/sport-create.schema.validation';
import { HeadersPaginationInterceptor } from 'src/common/interceptors/headers-pagination.interceptors';
import { SportUpdateSchema } from './validations/sport-update.schema.validation';

@ApiTags('sport')
@Controller('sport')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class SportController {
  constructor(private readonly service: SportService) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create sport' })
  @ApiCreatedResponse({ description: 'Not content' })
  create(
    @Payload(new JoiValidationPipe(new SportCreateSchema()))
    payload: CreateSportDto,
  ) {
    return this.service.create(payload);
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all sports' })
  @ApiOkResponse({ description: 'List all sports', type: Sport })
  @UseInterceptors(HeadersPaginationInterceptor)
  async findAll(): Promise<any> {
    const { data, cursor } = await this.service.findAll();
    return { data, cursor };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one sport by ID' })
  @ApiOkResponse({ description: 'Sport object', type: Sport })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<Sport | undefined> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a sport' })
  @ApiNoContentResponse({ description: 'No content' })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Payload(new JoiValidationPipe(new SportUpdateSchema()))
    payload: UpdateSportDto,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a sport' })
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
