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
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt-auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { HeadersPaginationInterceptor } from 'src/common/interceptors/headers-pagination.interceptors';
import { AgentService } from './agent.service';
import { AgentCreateSchema } from './validations/agent-create.schema.validation';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AgentUpdateSchema } from './validations/agent-update.schema.validation';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { Request } from 'express';

@ApiTags('agent')
@Controller('agent')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class AgentController {
  constructor(private readonly service: AgentService) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create agent' })
  @ApiCreatedResponse({ description: 'Not content' })
  async create(
    @Payload(new JoiValidationPipe(new AgentCreateSchema()))
    payload: CreateAgentDto,
    @Req() request: Request,
  ): Promise<void> {
    const { user } = request;
    return this.service.create(payload, user);
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all agents' })
  @ApiOkResponse({ description: 'List all agents', type: Agent })
  @UseInterceptors(HeadersPaginationInterceptor)
  async findAll(@Query() query, @Req() request): Promise<any> {
    const { user } = request;
    const { data, cursor } = await this.service.findAll(query, user);
    return { data, cursor };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one agent by ID' })
  @ApiOkResponse({ description: 'Agent object', type: Agent })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<Agent | undefined> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update agent info' })
  @ApiNoContentResponse({ description: 'Updated successfully', type: Agent })
  @ApiNotFoundResponse({ description: 'Not found', type: ErrorSchema })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Payload(new JoiValidationPipe(new AgentUpdateSchema()))
    payload: UpdateAgentDto,
  ): Promise<void> {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a agent' })
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
