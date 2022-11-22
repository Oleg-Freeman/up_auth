import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogoutParamsDto, RegisterDto } from './dto';
import { CreateUserResponseInterceptor } from './interceptors';
import { AuthGuard } from './guards';
import { UserDocument } from './user.model';
import { UserResponseInterface } from './interfaces';
import { Token, User } from './decorators';

@Controller('/auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseInterceptors(CreateUserResponseInterceptor)
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: RegisterDto,
  ): Promise<UserResponseInterface<UserDocument>> {
    return this._authService.register(body);
  }

  @UseInterceptors(CreateUserResponseInterceptor)
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
  ): Promise<UserResponseInterface<UserDocument>> {
    return this._authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @User() user: UserDocument,
    @Token() token: string,
    @Query() query: LogoutParamsDto,
  ): Promise<void> {
    return this._authService.logout({ user, token, all: query.all });
  }
}
