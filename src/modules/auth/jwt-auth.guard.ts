import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token =
      request.cookies.accesstoken ||
      request.query.accesstoken ||
      request.body.accesstoken ||
      request.headers.accesstoken;
    const user = this.authService.validateUser(token);
    request.currentUser = user;
    return true;
  }
}
