import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private role: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.role.includes(request.currentUser.role.toLowerCase());

    // if (!user) {
    //   throw new ForbiddenException('User not found');
    // }

    // if (user.role !== this.role) {
    //   throw new ForbiddenException(
    //     'You do not have permission to access this resource',
    //   );
    // }

    // return true;
  }
}
