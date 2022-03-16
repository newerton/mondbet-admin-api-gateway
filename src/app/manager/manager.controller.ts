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
import { CreateManagerDto } from './dto/create-manager.dto';
import { Manager } from './entities/manager.entity';
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
import { ManagerService } from './manager.service';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { Payload } from '@nestjs/microservices';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt-auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { ManagerCreateSchema } from './validations/manager-create.schema.validation';
import { ManagerUpdateSchema } from './validations/manager-update.schema.validation';
import { HeadersPaginationInterceptor } from 'src/common/interceptors/headers-pagination.interceptors';

@ApiTags('manager')
@Controller('manager')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ManagerController {
  constructor(private readonly service: ManagerService) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create manager' })
  @ApiCreatedResponse({ description: 'Not content' })
  async create(
    @Payload(new JoiValidationPipe(new ManagerCreateSchema()))
    payload: CreateManagerDto,
  ): Promise<void> {
    return this.service.create(payload);
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all managers' })
  @ApiOkResponse({ description: 'List all managers', type: Manager })
  @UseInterceptors(HeadersPaginationInterceptor)
  async findAll(@Query() query): Promise<any> {
    const { data, cursor } = await this.service.findAll(query);
    return { data, cursor };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one manager by ID' })
  @ApiOkResponse({ description: 'Manager object', type: Manager })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<Manager | undefined> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update manager info' })
  @ApiNoContentResponse({ description: 'No content' })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Payload(new JoiValidationPipe(new ManagerUpdateSchema()))
    payload: UpdateManagerDto,
  ): Promise<void> {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a manager' })
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
