import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  EMAIL_REG_EX,
  NOT_VALID_PHONE_OR_EMAIL,
  PHONE_NUMBER_REG_EX,
} from '../../constants';

export function IsPhoneNumberOrEmail(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsPhoneNumberOrEmailConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsPhoneNumberOrEmailConstraint' })
export class IsPhoneNumberOrEmailConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, validationArguments: ValidationArguments): boolean {
    const id = (validationArguments.object as { [key: string]: string }).id;

    return PHONE_NUMBER_REG_EX.test(id) || EMAIL_REG_EX.test(id);
  }

  defaultMessage(): string {
    return NOT_VALID_PHONE_OR_EMAIL;
  }
}
