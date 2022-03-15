import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from 'src/common/schemas/Error.schema';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Auth } from './entities/auth.entity';

@ApiTags('auth')
@Controller('auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email' })
  @ApiOkResponse({
    description: 'Login successfully',
    type: Auth,
  })
  async login(@Payload() payload: LoginAuthDto) {
    return this.service.login(payload);
  }
}
