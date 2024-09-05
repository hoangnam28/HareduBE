import { Roles } from '@common/constants/global.const';
import { ROLES_KEY } from '@common/decorators/roles.decorator';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { getUserTokenByRequest } from './guard.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[] | Roles>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = getUserTokenByRequest(request);
    const permission = user.role;

    const isValid = Array.isArray(requiredRoles) ? requiredRoles.includes(permission) : requiredRoles === permission;
    if (!isValid) throw new BadRequestException('access-denied');

    return true;
  }
}
