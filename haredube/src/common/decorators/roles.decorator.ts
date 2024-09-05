import { Roles } from '@common/constants/global.const';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const RolesPermission = (role: Roles | Roles[]) => SetMetadata(ROLES_KEY, role);
