import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserResponseInterface } from '../interfaces';
import { UserDocument } from '../user.model';

@Injectable()
export class CreateUserResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(({ user, token }: UserResponseInterface<UserDocument>) => ({
        token,
        user: { ...user.toObject(), password: undefined, tokens: undefined },
      })),
    );
  }
}
