import { IsNotEmpty, Length, Matches } from 'class-validator';
import {
  NOT_VALID_NAME,
  NOT_VALID_PASSWORD,
  PASSWORD_REG_EX,
  USER_NAME_REG_EX,
  validationOptions,
} from '../../constants';
import { IsPhoneNumberOrEmail } from '../decorators';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(
    validationOptions.minStringFieldLength,
    validationOptions.maxStringFieldLength,
  )
  @Matches(USER_NAME_REG_EX, {
    message: NOT_VALID_NAME,
  })
  readonly name: string;

  @ApiProperty()
  @IsPhoneNumberOrEmail()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(PASSWORD_REG_EX, {
    message: NOT_VALID_PASSWORD,
  })
  readonly password: string;
}
