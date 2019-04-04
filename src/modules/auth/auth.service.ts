import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(user: any): Promise<any> {
    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt.sign({ user }, 'dXNlcm5hbWUrcGFzc3dvcmQ=', {
      expiresIn,
    });
    return {
      ...user,
      expiresIn,
      accessToken,
    };
  }

  validateUser(token: string): any {
    if (!token) {
      throw new UnauthorizedException('未授权');
    }
    let ret;
    try {
      ret = jwt.verify(token, 'dXNlcm5hbWUrcGFzc3dvcmQ=') as any;
    } catch (err) {
      throw new UnauthorizedException('未授权');
    }
    const { exp, user } = ret;
    if (Date.now() > exp * 1000 || !user) {
      throw new UnauthorizedException('未授权');
    }
    return user;
  }
}
