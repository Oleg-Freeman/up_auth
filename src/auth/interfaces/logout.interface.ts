import { UserDocument } from '../user.model';

export interface LogoutInterface {
  token: string;
  user: UserDocument;
  all: boolean;
}
