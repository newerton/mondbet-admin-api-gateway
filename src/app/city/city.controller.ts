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
import { CityService } from './city.service';
import { City } from './entities/city.entity';

@ApiTags('city')
@Controller('city')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class CityController {
  constructor(private readonly service: CityService) {}

  @Get(':state_id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all cities by state ID' })
  @ApiOkResponse({ description: 'List all cities', type: City })
  findAll(
    @Param(
      'state_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    state_id: string,
  ): Promise<City[]> {
    return this.service.findAll(state_id);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
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
}
