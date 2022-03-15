import {
  Controller,
  Post,
  HttpCode,
  Put,
  Get,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
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
import { UserCreateSchema } from './validations/user-create.schema.validation';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'Created successfully', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
    type: ErrorSchema,
  })
  async create(
    @Payload(new JoiValidationPipe(new UserCreateSchema()))
    payload: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(payload);
  }

  @Put('update')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user info' })
  @ApiNoContentResponse({ description: 'Updated successfully', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
  @ApiNotFoundResponse({ description: 'Not found', type: ErrorSchema })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
  update(
    @Payload() payload: UpdateUserDto,
    @Request() request: any,
  ): Promise<void> {
    console.log({ request });
    const id = request.user.id;
    return this.userService.update(id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Show user info' })
  @ApiOkResponse({ description: 'User info', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
  @ApiNotFoundResponse({ description: 'Not found', type: ErrorSchema })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
  me(@Request() request: any): Promise<User> {
    return this.userService.findById(request.user.id);
  }
}
