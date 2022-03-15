import {
  Controller,
  Get,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { StateService } from './state.service';
import { State } from './entities/state.entity';

@ApiTags('state')
@Controller('state')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class StateController {
  constructor(private readonly service: StateService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List all states' })
  @ApiOkResponse({ description: 'List all states', type: State })
  findAll(): Promise<State[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(200)
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
