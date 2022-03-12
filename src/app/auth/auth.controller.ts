import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email' })
  @ApiOkResponse({
    description: 'Login successfully',
    type: Auth,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorSchema })
  @ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
  async login(@Body() login: LoginAuthDto) {
    console.log({ login });
    return this.authService.login(login);
  }
}
