import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { RefreshTokenDTO } from './dtos/refresh-token.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthDecorator } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @AuthDecorator(AuthType.None)
  public async signIn(@Body() signInDTO: SignInDto) {
    return await this.authService.signIn(signInDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  @AuthDecorator(AuthType.None)
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDTO) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
