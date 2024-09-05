import { User } from '@models/user.model';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.excludePasswordFromResponse(data)));
  }

  private excludePasswordFromResponse(data: User | User[]): any {
    return Array.isArray(data)
      ? data[0].toObject().password && data.map((item) => this.excludePassword(item))
      : data.toObject().password && this.excludePassword(data.toObject());
  }

  private excludePassword(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
