import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  EMAIL_REG_EX,
  ModelNames,
  NOT_VALID_PASSWORD,
  NOT_VALID_PHONE_OR_EMAIL,
  PASSWORD_REG_EX,
  PHONE_NUMBER_REG_EX,
} from '../constants';
import { IdTypes } from '../constants/id-types';

@Schema({ versionKey: false, collection: ModelNames.USER, timestamps: true })
export class UserModel {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v: string) =>
        PHONE_NUMBER_REG_EX.test(v) || EMAIL_REG_EX.test(v),
      message: () => NOT_VALID_PHONE_OR_EMAIL,
    },
  })
  login: string;

  @Prop({ required: true, enum: IdTypes })
  idType: IdTypes;

  @Prop({
    required: true,
    trim: true,
    match: [PASSWORD_REG_EX, NOT_VALID_PASSWORD],
    select: false,
  })
  password: string;

  @Prop({ required: false })
  tokens?: string[];
}

const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['password'];
    delete ret['tokens'];
    return ret;
  },
});

export { UserSchema };

export type UserDocument = UserModel & Document;
