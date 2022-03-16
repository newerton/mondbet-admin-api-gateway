import {
  Controller,
  Post,
  HttpCode,
  Get,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { Public } from 'src/common/decorators/public.decorator';
import { Auth } from '../auth/entities/auth.entity';
import { LoginAuthDto } from '../auth/dto/login-auth.dto';
import { AuthManagerService } from './auth-manager.service';
import { ManagerService } from '../manager/manager.service';
import { Manager } from '../manager/entities/manager.entity';

@ApiTags('auth-manager')
@Controller('auth/manager')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class AuthManagerController {
  constructor(
    private readonly service: AuthManagerService,
    private readonly managerService: ManagerService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email' })
  @ApiOkResponse({
    description: 'Login successfully',
    type: Auth,
  })
  @Public()
  async login(@Payload() payload: LoginAuthDto) {
    return this.service.login(payload);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Show manager info' })
  @ApiOkResponse({ description: 'Manager info', type: Manager })
  @ApiNotFoundResponse({ description: 'Not found', type: ErrorSchema })
  me(@Request() request: any): Promise<Manager> {
    return this.managerService.findById(request.user.id);
  }
}
