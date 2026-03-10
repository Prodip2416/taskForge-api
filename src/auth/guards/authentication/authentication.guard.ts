import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../../decorators/auth.decorator';
import { AdminUserGuard } from '../admin-user/admin-user.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly adminUserGuard: AdminUserGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
      [AuthType.Admin]: [this.accessTokenGuard, this.adminUserGuard], // need this for first check access token
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    let error = new UnauthorizedException();

    for (const authType of authTypes) {
      const guardOrGuards = this.authTypeGuardMap[authType];
      const guards = Array.isArray(guardOrGuards)
        ? guardOrGuards
        : [guardOrGuards];

      let allPassed = true;

      for (const guard of guards) {
        const canActivate = await Promise.resolve(
          guard.canActivate(context),
        ).catch((err) => {
          error = err;
          return false;
        });

        if (!canActivate) {
          allPassed = false;
          break;
        }
      }

      if (allPassed) return true;
    }

    throw error;
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   // Print authTypeGuardMap
  //   const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
  //     AUTH_TYPE_KEY,
  //     [context.getHandler(), context.getClass()],
  //   ) ?? [AuthenticationGuard.defaultAuthType];
  //   // Show what are authTypes
  //   // console.log(authTypes);

  //   const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
  //   // printeGuards => Show that the user can pass an array in users controller as well
  //   // console.log(guards);

  //   // Declare the default error
  //   let error = new UnauthorizedException();

  //   for (const instance of guards) {
  //     // print each instance
  //     // console.log(instance);
  //     // Decalre a new constant
  //     const canActivate = await Promise.resolve(
  //       // Here the AccessToken Guard Will be fired and check if user has permissions to acces
  //       // Later Multiple AuthTypes can be used even if one of them returns true
  //       // The user is Authorised to access the resource
  //       instance.canActivate(context),
  //     ).catch((err) => {
  //       error = err;
  //     });

  //     // Display Can Activate
  //     // console.log(canActivate);
  //     if (canActivate) {
  //       return true;
  //     }
  //   }

  //   throw error;
  // }
}
