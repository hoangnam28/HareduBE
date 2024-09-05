import { Roles } from '@common/constants/global.const';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { RolesPermission } from './roles.decorator';

export function Auth(roles: Roles[] | Roles) {
  return applyDecorators(RolesPermission(roles), UseGuards(RolesGuard));
}
