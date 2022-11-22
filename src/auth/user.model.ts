import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  EMAIL_REG_EX,
  ModelNames,
  NOT_VALID_PASSWORD,
  NOT_VALID_PHONE_OR_EMAIL,
  PASSWORD_REG_EX,
  PHONE_NUMBER_REG_EX,
  IdTypes,
  BaseModel,
} from '../constants';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false, collection: ModelNames.USER, timestamps: true })
export class UserModel extends BaseModel {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty()
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

  @ApiProperty()
  @Prop({ required: true, enum: IdTypes })
  idType: IdTypes;

  @Prop({
    required: true,
    trim: true,
    match: [PASSWORD_REG_EX, NOT_VALID_PASSWORD],
  })
  password: string;

  @ApiProperty()
  @Prop({ required: false })
  tokens?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

export type UserDocument = UserModel & Document & { _id: Types.ObjectId };
