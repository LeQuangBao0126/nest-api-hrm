import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // username , pass là 2 tham số thư viện passport ném về
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isValid) {
        return user;
      }
      return null;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: _id,
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    //createRefreshToken
    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refreshToken, _id);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 86400000,
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    let newUser = await this.usersService.register(registerUserDto);

    return {
      _id: newUser._id,
      createdAt: newUser?.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refreshToken;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
      const decoded = this.jwtService.verify<IUser>(refreshToken, { secret });

      // user ban
      const u = await this.usersService.findOne(decoded._id);
      if (u.isDeleted) {
        throw new BadRequestException('user is deleted');
      }
      // update refresh token
      const payload = {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
      };
      const newRefreshToken = this.createRefreshToken(payload);
      await this.usersService.updateUserToken(
        newRefreshToken,
        u._id.toString(),
      );

      // tra ve access_token
      response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 86400000,
      });
      const access_token = this.jwtService.sign(payload);
      return {
        access_token,
        user: {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('refresh token khong hợp lệ');
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  };
}
