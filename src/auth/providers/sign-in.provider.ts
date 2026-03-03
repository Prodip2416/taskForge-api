import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UserService } from '../../user/providers/user.service';
import { HashingProvider } from '../hashing/provider/hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly usersService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // find user by email ID
    const user = await this.usersService.findOneByEmail(signInDto.email);
    let isEqual: boolean = false;

    try {
      // Compare the password to hash
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare the password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    // Generate access token
    return await this.generateTokensProvider.generateTokens(user);
  }
}
