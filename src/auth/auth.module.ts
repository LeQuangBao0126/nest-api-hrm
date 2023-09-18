import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/passport/jwt.strategy';
// auth ko cần controller nên chỉ cần tạo module , ko cần nest g resource như user
@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    // bất đồng bộ . đợi configService có rồi mới inject vào và set option
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRE'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ], // import nguyen module để sử dụng full luôn | chứ import service thì nó cần inject model , ....
  exports: [AuthService],
})
export class AuthModule {}
