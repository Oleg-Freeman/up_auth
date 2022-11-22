import { UserModel } from '../auth';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  token: string;
}

export class UserResponse extends BaseResponse {
  @ApiProperty({ type: () => UserModel })
  user: UserModel;
}

export class InfoResponse extends BaseResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  idType: string;
}
