import {
  Get,
  Post,
  Res,
  Req,
  Controller,
  UseGuards,
  Body,
  Query,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard as JwtAuthGuard } from './../auth/jwt-auth.guard';
import { StatusCode } from '../../common/error-status';
import { User, AccountStatus, Sex } from './user.entity';
import { md5, checkFormat, formatResponse } from '../../common/util';

@Controller('admin/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async actionList(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    offset = Number(offset) || 0;
    limit = Number(limit) || 25;
    const [rows, total] = await this.userService.getUsers({ limit, offset });
    return { rows, total };
  }

  @Get('info')
  async actionInfo(@Req() req: any) {
    const user = this.authService.getUser(req, false);
    return await this.userService.getUser({ id: user && user.id }) || {};
  }

  @Post('logout')
  actionLogout(@Res() res: any) {
    res.clearCookie('accesstoken');
    return res.send(formatResponse(null, StatusCode.OK));
  }

  @Post('login')
  async actionLogin(
    @Res() res: any,
    @Body('name') name: string,
    @Body('password') pwd: string,
  ) {
    let error = '';
    if (!name || !pwd) {
      error = '请输入完整的账号信息！';
    }
    if (error) {
      throw new HttpException(`字段验证失败[${error}]`, StatusCode.FAIL);
    }
    let user = await this.userService.getUser({ name, password: md5(pwd) });
    if (!user) {
      user = await this.userService.getUser({ email: name, password: md5(pwd) });
    }
    if (!user) {
      throw new HttpException(`账号信息不正确！`, StatusCode.FAIL);
    }
    if (user.status === AccountStatus.BLOCKED) {
      throw new HttpException(`账户未激活，请联系管理员！`, StatusCode.FAIL);
    }
    const tokenData = await this.authService.createToken(user);
    res.cookie('accesstoken', tokenData.accessToken, {
      httpOnly: true,
      maxAge: tokenData.expiresIn,
    });
    return res.send(formatResponse(tokenData, StatusCode.OK));
  }

  @Post('register')
  async actionRegister(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') pwd: string,
    @Body('repassword') rpwd: string,
  ) {
    let error = '';
    if (!name || !pwd || !rpwd || !email) {
      error = '请输入完整的账号信息！';
    } else if (name.length < 2 || name.length > 32) {
      error = '用户名长度最小2，最大32！';
    } else if (pwd.length < 2 || pwd.length > 32) {
      error = '密码长度最小2，最大32！';
    } else if (pwd !== rpwd) {
      error = '两次输入密码不一致！';
    } else if (await this.userService.getUser({ name })) {
      error = '用户名已存在！';
    } else if (!checkFormat('email', email)) {
      error = '邮箱格式不正确！';
    } else if (await this.userService.getUser({ email })) {
      error = '邮箱已注册！';
    }

    if (error) {
      throw new HttpException(`字段验证失败[${error}]`, StatusCode.FAIL);
    }
    const user = new User();
    user.name = name;
    user.status = AccountStatus.BLOCKED;
    user.sex = Sex.UNKNOWN;
    user.email = email;
    user.password = md5(pwd);
    const ret = await this.userService.insertUser(user);
    return await this.userService.getUser({ id: ret.raw.insertId });
  }
}
