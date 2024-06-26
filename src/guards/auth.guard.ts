import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Get token from header
    const authHeader = request.headers.authorization;

    // Kiểm tra nếu authHeader tồn tại và có giá trị
    if (!authHeader) {
      throw new ForbiddenException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];

    // Kiểm tra nếu token tồn tại và có giá trị
    if (!token) {
      throw new ForbiddenException('Please provide an access token');
    }

    // 2. JwtVerify validate token
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: 'my_jwt_secret_key',
      });
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }

    // 3. Find user in db based on jwtVerify
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    // Log the required user information
    //console.log(user);

    // 4. Assign user to request object
    request.currentUser = user;
    return true;
  }
}
