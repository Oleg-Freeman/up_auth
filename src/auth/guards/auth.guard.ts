import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../user.model';
import { ModelNames, UNAUTHORIZED } from '../../constants';
import { AuthDto } from '../dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectModel(ModelNames.USER)
    private readonly _userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const autHeader = req.headers.authorization || '';
    const [bearer, token] = autHeader.split(' ');

    try {
      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          { error: UNAUTHORIZED },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const { userId }: AuthDto = this._jwtService.verify(token);
      const user = await this._userModel.findById(userId);

      if (
        !user ||
        !user.tokens ||
        !user.tokens.length ||
        !user.tokens.includes(token)
      ) {
        throw new HttpException(
          { error: UNAUTHORIZED },
          HttpStatus.UNAUTHORIZED,
        );
      }

      req.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
