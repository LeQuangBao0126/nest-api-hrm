import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Request,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('user login')
  async handleLogin(@Req() req, @Res({ passthrough: true }) res) {
    const rs = await this.authService.login(req.user, res);
    return rs;
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Get('profile')
  //   getProfile(@Request() req) {
  //     return req.user;
  //   }

  // register dành cho client đăng kí tài khoản thường .còn user he thống là có apis của user riêng
  // ko cần truyền token .
  @Public() //by pass global JWT check
  @ResponseMessage('Đăng kí tài khoản cá nhân mới')
  @Post('register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage('Thông tin tài khoản')
  @Get('account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage('refresh token ')
  @Get('refresh')
  // phải có passthrough neu ko nó bị kẹt
  async handleRefreshToken(@Req() req, @Res({ passthrough: true }) res) {
    // lay refresh token từ cookie
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      //redirect to logout
    }
    const rs = await this.authService.processNewToken(refreshToken, res);
    return rs;
  }

  @ResponseMessage('logout')
  @Post('logout')
  handleLogout(@Res({ passthrough: true }) res, @User() user: IUser) {
    return this.authService.logout(res, user);
  }
}
