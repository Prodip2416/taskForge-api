import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { HashingModule } from './hashing/hashing.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt-config/jwt.config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInProvider,
    RefreshTokensProvider,
    GenerateTokensProvider,
  ],
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    HashingModule,
    UserModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
