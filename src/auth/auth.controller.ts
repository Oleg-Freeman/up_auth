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
import { InfoInterface, UserResponseInterface } from './interfaces';
import { Token, User } from './decorators';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InfoResponse, UserResponse } from '../constants';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseInterceptors(CreateUserResponseInterceptor)
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User sign up' })
  @ApiCreatedResponse({ type: UserResponse })
  async register(
    @Body() body: RegisterDto,
  ): Promise<UserResponseInterface<UserDocument>> {
    return this._authService.register(body);
  }

  @UseInterceptors(CreateUserResponseInterceptor)
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User sign in' })
  @ApiOkResponse({ type: UserResponse })
  async login(
    @Body() body: LoginDto,
  ): Promise<UserResponseInterface<UserDocument>> {
    return this._authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User logout' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  async logout(
    @User() user: UserDocument,
    @Token() token: string,
    @Query() query: LogoutParamsDto,
  ): Promise<void> {
    return this._authService.logout({ user, token, all: query.all });
  }

  @UseGuards(AuthGuard)
  @Get('/info')
  @ApiOperation({ summary: 'Get user info' })
  @ApiOkResponse({ type: InfoResponse })
  @ApiBearerAuth()
  async info(@User() user: UserDocument): Promise<InfoInterface> {
    return this._authService.info(user);
  }
}
