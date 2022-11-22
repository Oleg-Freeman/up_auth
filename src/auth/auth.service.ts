import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  EMAIL_REG_EX,
  ModelNames,
  NOT_VALID_CREDENTIALS,
  USER_ALREADY_REGISTERED,
  IdTypes,
} from '../constants';
import { UserDocument } from './user.model';
import { RegisterDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UserResponseInterface, LogoutInterface } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(ModelNames.USER)
    private readonly _userModel: Model<UserDocument>,
    private readonly _jwtService: JwtService,
  ) {}

  async register({
    password,
    id,
    name,
  }: RegisterDto): Promise<UserResponseInterface<UserDocument>> {
    const user = await this._userModel.findOne({ login: id });

    if (user) {
      throw new HttpException(
        { error: USER_ALREADY_REGISTERED },
        HttpStatus.CONFLICT,
      );
    }

    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    const newUser = await this._userModel.create({
      password: passwordHash,
      name,
      login: id,
      idType: EMAIL_REG_EX.test(id) ? IdTypes.EMAIL : IdTypes.PHONE,
    });

    const token = await this.getToken(newUser);

    return { user: newUser, token };
  }

  async login({
    password,
    id,
  }: LoginDto): Promise<UserResponseInterface<UserDocument>> {
    const user = await this._userModel.findOne({ login: id });

    if (!user) {
      throw new HttpException(
        { error: NOT_VALID_CREDENTIALS },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException(
        { error: NOT_VALID_CREDENTIALS },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.getToken(user);

    return { token, user };
  }

  async logout({ user, token, all }: LogoutInterface): Promise<void> {
    await this._userModel.findByIdAndUpdate(user._id, {
      ...(all ? { $unset: { tokens: 1 } } : { $pull: { tokens: token } }),
    });
  }

  async info(user: UserDocument) {
    const token = await this.getToken(user);

    return { id: user.login, idType: user.idType, token };
  }

  private async getToken(user: UserDocument) {
    const token = this._jwtService.sign({ userId: user.id });
    user.tokens = (user.tokens && user.tokens.length ? user.tokens : []).concat(
      [token],
    );

    await user.save();

    return token;
  }
}
