import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseInterface } from './interfaces';
import { ClearUserResponseInterceptor } from './interceptors';

@Controller('/auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseInterceptors(new ClearUserResponseInterceptor())
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<UserResponseInterface> {
    return this._authService.register(body);
  }

  @UseInterceptors(new ClearUserResponseInterceptor())
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<UserResponseInterface> {
    return this._authService.login(body);
  }
}
