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
import { CityService } from './city.service';
import { City } from './entities/city.entity';

@ApiTags('city')
@Controller('city')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class CityController {
  constructor(private readonly service: CityService) {}

  @Get('state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'List all cities by state ID' })
  @ApiOkResponse({ description: 'List all cities', type: City })
  findAll(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<City[]> {
    return this.service.findAll(id);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one city by ID' })
  @ApiOkResponse({ description: 'City object', type: City })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<City | undefined> {
    return this.service.findOne(id);
  }

  @Get(':state_id/:title')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one city by state ID and city title' })
  @ApiOkResponse({ description: 'City object', type: City })
  findOneByStateAndTitle(
    @Param('state_id')
    state_id: string,
    @Param('title')
    title: string,
  ): Promise<City | undefined> {
    return this.service.findOneByStateAndTitle(state_id, title);
  }
}
