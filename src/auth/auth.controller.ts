import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { UserDocument } from './user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: RegisterDto,
  ): Promise<{ user: UserDocument; token: string }> {
    return this._authService.register(body);
  }
}
