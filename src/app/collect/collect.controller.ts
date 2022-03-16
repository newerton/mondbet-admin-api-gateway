import {
  Controller,
  Post,
  HttpCode,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Patch,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateCollectDto } from './dto/create-collect.dto';
import { Collect } from './entities/collect.entity';
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
import { CollectService } from './collect.service';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { Payload } from '@nestjs/microservices';
import { UpdateCollectDto } from './dto/update-collect.dto';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt-auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { CollectCreateSchema } from './validations/collect-create.schema.validation';
import { CollectUpdateSchema } from './validations/collect-update.schema.validation';
import { HeadersPaginationInterceptor } from 'src/common/interceptors/headers-pagination.interceptors';

@ApiTags('collect')
@Controller('collect')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class CollectController {
  constructor(private readonly service: CollectService) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create collect' })
  @ApiCreatedResponse({ description: 'Not content' })
  async create(
    @Payload(new JoiValidationPipe(new CollectCreateSchema()))
    payload: CreateCollectDto,
  ): Promise<void> {
    return this.service.create(payload);
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all collects' })
  @ApiOkResponse({ description: 'List all collects', type: Collect })
  @UseInterceptors(HeadersPaginationInterceptor)
  async findAll(@Query() query): Promise<any> {
    const { data, cursor } = await this.service.findAll(query);
    return { data, cursor };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one collect by ID' })
  @ApiOkResponse({ description: 'Collect object', type: Collect })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<Collect | undefined> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update collect info' })
  @ApiNoContentResponse({ description: 'No content' })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Payload(new JoiValidationPipe(new CollectUpdateSchema()))
    payload: UpdateCollectDto,
  ): Promise<void> {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a collect' })
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
