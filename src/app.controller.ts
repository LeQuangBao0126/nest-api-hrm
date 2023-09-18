import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  //   constructor(
  //     // private readonly appService: AppService,
  //     // private readonly configService: ConfigService,
  //     private readonly authService: AuthService,
  //   ) {}
  //   @Public()
  //   @Post('login')
  //   @UseGuards(LocalAuthGuard)
  //   async handleLogin(@Request() req) {
  //     const rs = await this.authService.login(req.user);
  //     return rs;
  //   }
  //   @UseGuards(JwtAuthGuard)
  //   @Get('profile')
  //   getProfile(@Request() req) {
  //     return req.user;
  //   }
}
