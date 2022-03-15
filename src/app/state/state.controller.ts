import {
  Controller,
  Get,
  Param,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt-auth.guard';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { StateService } from './state.service';
import { State } from './entities/state.entity';

@ApiTags('state')
@Controller('state')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class StateController {
  constructor(private readonly service: StateService) {}

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all states' })
  @ApiOkResponse({ description: 'List all states', type: State })
  findAll(): Promise<State[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one state by ID' })
  @ApiOkResponse({ description: 'State object', type: State })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<State | undefined> {
    return this.service.findOne(id);
  }
}
