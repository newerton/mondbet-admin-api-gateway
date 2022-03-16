import {
  Controller,
  Post,
  HttpCode,
  Get,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  Patch,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
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
import { UserService } from './user.service';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt-auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidation.pipe';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserSchema } from './validations/create-user.schema.validation';
import { UpdateUserSchema } from './validations/update-user.schema.validation';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'Not content' })
  @Public()
  async create(
    @Payload(new JoiValidationPipe(new CreateUserSchema()))
    payload: CreateUserDto,
  ): Promise<void> {
    return this.service.create(payload);
  }

  @Patch('update')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update manager info' })
  @ApiNoContentResponse({ description: 'Updated successfully', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ErrorSchema })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Payload(new JoiValidationPipe(new UpdateUserSchema()))
    payload: UpdateUserDto,
  ): Promise<void> {
    return this.service.update(id, payload);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Show user info' })
  @ApiOkResponse({ description: 'User info', type: User })
  @ApiNotFoundResponse({ description: 'Not found', type: ErrorSchema })
  me(@Request() request: any): Promise<User> {
    return this.service.findById(request.user.id);
  }
}
