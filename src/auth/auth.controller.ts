import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from '../users/dto/user.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @ApiResponse({
    example: {
      success: true,
      message: 'User successfully registered',
    },
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return {
      success: true,
      message: 'User successfully registered',
    };
  }

  @Post('signin')
  @ApiResponse({
    example: {
      success: true,
      message: 'User successfully signed in',
      accessToken: 'your_jwt_token_here',
    },
  })
  async signIn(@Body() signInDto: SignInDto) {
    const token = await this.authService.signIn(signInDto);
    return {
      success: true,
      message: 'User successfully signed in',
      accessToken: token,
    };
  }
}
