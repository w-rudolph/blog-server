import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

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

  getUser(request: any, throwError = true) {
    const token =
      request.cookies.accesstoken ||
      request.query.accesstoken ||
      request.body.accesstoken ||
      request.headers.accesstoken;
    return this.validateUser(token, throwError);
  }

  validateUser(token: string, throwError: boolean): any {
    if (!token) {
      return this._handleError(throwError);
    }
    let ret: any;
    try {
      ret = jwt.verify(token, 'dXNlcm5hbWUrcGFzc3dvcmQ=') as any;
    } catch (err) {
      return this._handleError(throwError);
    }
    const { exp, user } = ret;
    if (Date.now() > exp * 1000 || !user) {
      return this._handleError(throwError);
    }
    return user;
  }

  private _handleError(throwError: boolean) {
    if (throwError) throw new UnauthorizedException('未授权');
    return {};
  }
}
