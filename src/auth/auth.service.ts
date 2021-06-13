import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validationUserPassword(
      authCredentialsDto,
    );
    // console.log(username);
    if (!username) {
      throw new UnauthorizedException('invalid Credentials');
    }
    const payload: JwtPayload = { username };

    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated jWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
