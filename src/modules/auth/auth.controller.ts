import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login-request/login-request';
import { LoginResponse } from './dto/login-response/login-response';
import { SignupRequest } from './dto/signup-request/signup-request';
import { SignupResponse } from './dto/signup-response/signup-response';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in',
    type: LoginResponse,
  })
  login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(body);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Signup a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully signed up',
    type: SignupResponse,
  })
  signup(@Body() body: SignupRequest): Promise<SignupResponse> {
    return this.authService.signup(body);
  }
}
