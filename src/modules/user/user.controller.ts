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
  ) {}

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
    return (
      (await this.userService.getUserSimpleInfo({ id: user && user.id })) || {}
    );
  }

  @Get('detail')
  @UseGuards(JwtAuthGuard)
  async actiondetail(@Req() req: any) {
    const user = this.authService.getUser(req, false);
    return (
      (await this.userService.getUserDetail({ id: user && user.id })) || {}
    );
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
    let user = await this.userService.getUserSimpleInfo({
      name,
      password: md5(pwd),
    });
    if (!user) {
      user = await this.userService.getUserSimpleInfo({
        email: name,
        password: md5(pwd),
      });
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
    } else if (name.length < 2 || name.length > 12) {
      error = '用户名长度最小2，最大12！';
    } else if (pwd !== rpwd) {
      error = '两次输入密码不一致！';
    } else if (await this.userService.getUserSimpleInfo({ name })) {
      error = '用户名已存在！';
    } else if (!checkFormat('email', email)) {
      error = '邮箱格式不正确！';
    } else if (await this.userService.getUserSimpleInfo({ email })) {
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
    return await this.userService.getUserSimpleInfo({ id: ret.raw.insertId });
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async actionSave(
    @Req() req: any,
    @Body('email') email: string,
    @Body('sex') sex: number,
  ) {
    sex = Number(sex);
    if (!checkFormat('email', email)) {
      throw new HttpException(`邮箱不正确`, StatusCode.FAIL);
    }
    if (Sex[sex] === undefined) {
      throw new HttpException(`性别值不正确`, StatusCode.FAIL);
    }
    const userId = req.currentUser.id;
    const fdUser = await this.userService.checkUserEmailValid(email, userId);
    if (fdUser) {
      throw new HttpException(`邮箱已被注册`, StatusCode.FAIL);
    }

    const user = await this.userService.getUser({ id: userId });
    user.email = email;
    user.sex = sex;
    await this.userService.saveUser(user);
    return {};
  }

  @Post('update-password')
  @UseGuards(JwtAuthGuard)
  async actionUpdatePassword(
    @Req() req: any,
    @Body('oldpassword') oldpassword: string,
    @Body('password') password: string,
    @Body('repassword') repassword: string,
  ) {
    let errMsg = '';
    if (!oldpassword || !password || !repassword) {
      errMsg = '请输入完整信息';
    } else if (password !== repassword) {
      errMsg = '两次输入密码不一致';
      throw new HttpException(`两次输入密码不一致`, StatusCode.FAIL);
    } else if (password === oldpassword) {
      errMsg = '新旧密码不能相同';
    }
    if (errMsg) {
      throw new HttpException(errMsg, StatusCode.FAIL);
    }
    const user = await this.userService.getUser({ id: req.currentUser.id });
    user.password = md5(password);
    await this.userService.saveUser(user);
    return {};
  }
}
