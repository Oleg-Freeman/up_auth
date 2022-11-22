import { IsNotEmpty, Length, Matches } from 'class-validator';
import {
  NOT_VALID_CREDENTIALS,
  PASSWORD_REG_EX,
  validationOptions,
} from '../../constants';
import { IsPhoneNumberOrEmail } from '../decorators';

export class LoginDto {
  @IsPhoneNumberOrEmail({ message: NOT_VALID_CREDENTIALS })
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REG_EX, {
    message: NOT_VALID_CREDENTIALS,
  })
  @Length(
    validationOptions.minPasswordLength,
    validationOptions.maxStringFieldLength,
    { message: NOT_VALID_CREDENTIALS },
  )
  readonly password: string;
}
