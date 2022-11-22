import { UserModel } from '../user.model';
import { Types, Document } from 'mongoose';

export interface UserResponseInterface {
  token: string;
  user: UserModel & Document & { _id: Types.ObjectId };
}
