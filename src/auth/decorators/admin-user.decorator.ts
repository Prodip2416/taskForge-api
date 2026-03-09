import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_ADMIN_KEY } from '../constants/auth.constants';
import { AdminUserData } from '../interfaces/admin-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof AdminUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AdminUserData = request[REQUEST_ADMIN_KEY];

    // If a user passes a field to the decorator use only that field
    return field ? user?.[field] : user;
  },
);
