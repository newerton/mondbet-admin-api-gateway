import {
  Controller,
  Post,
  HttpCode,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Patch,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
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
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { HeadersPaginationInterceptor } from 'src/common/interceptors/headers-pagination.interceptors';
import { CreateManagerSchema } from './validations/create-manager.schema.validation';
import { UpdateManagerSchema } from './validations/update-manager.schema.validation';
import { Request } from 'express';
import { AuthorizationGuard } from 'src/common/casl/authorization.guard.ts';
import { CheckPolicies } from 'src/common/casl/check-policies.decorator.ts';
import {
  ReadManagerPolicyHandler,
  UpdateManagerPolicyHandler,
} from './policies/manager-policy.handler';
import {
  Action,
  CaslAbilityFactory,
} from 'src/common/casl/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';

@ApiTags('manager')
@Controller('manager')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ManagerController {
  constructor(
    private readonly service: ManagerService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create manager' })
  @ApiCreatedResponse({ description: 'Not content' })
  async create(
    @Payload(new JoiValidationPipe(new CreateManagerSchema()))
    payload: CreateManagerDto,
    @Req() request: Request,
  ): Promise<void> {
    const { user } = request;
    return this.service.create(payload, user);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List all managers' })
  @ApiOkResponse({ description: 'List all managers', type: Manager })
  @UseInterceptors(HeadersPaginationInterceptor)
  async findAll(@Query() query, @Req() request: Request): Promise<any> {
    const { user } = request;
    const { data, cursor } = await this.service.findAll(query, user);
    return { data, cursor };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get one manager by ID' })
  @ApiOkResponse({ description: 'Manager object', type: Manager })
  @UseGuards(AuthorizationGuard)
  @CheckPolicies(new ReadManagerPolicyHandler())
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Req() request: Request,
  ): Promise<Manager | undefined> {
    const { user } = request;
    const model = await this.service.findById(id);

    try {
      const ability = await this.caslAbilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, model);
      return model;
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException({
          message: 'Restricted access',
          details: [{ message: err.message }],
        });
      }
    }
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update manager info' })
  @ApiNoContentResponse({ description: 'No content' })
  @UseGuards(AuthorizationGuard)
  @CheckPolicies(new UpdateManagerPolicyHandler())
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Payload(new JoiValidationPipe(new UpdateManagerSchema()))
    payload: UpdateManagerDto,
    @Req() request: Request,
  ): Promise<void> {
    const { user } = request;
    try {
      const model = await this.service.findById(id);
      const ability = await this.caslAbilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, model);
      return this.service.update(id, payload);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException({
          message: 'Restricted access',
          details: [{ message: err.message }],
        });
      }
    }
  }

  // @Delete(':id')
  // @HttpCode(204)
  // @ApiOperation({ summary: 'Delete a manager' })
  // @ApiNoContentResponse({ description: 'No content' })
  // @UseGuards(AuthorizationGuard)
  // remove(
  //   @Param(
  //     'id',
  //     new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   id: string,
  // ) {
  //   return this.service.remove(id);
  // }
}
