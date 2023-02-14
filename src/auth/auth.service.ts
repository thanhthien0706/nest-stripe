import * as bcrypt from 'bcrypt';
import { MessageName } from '@/common/message';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserRepository } from '@/users/user.repository';
import { UsersService } from '@/users/users.service';
import { ExistsException } from '@exceptions/exists.exeption';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_TYPE } from '@constants/jwt.type';
import { AuthDto } from './dto/auth.dto';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { AccessDeniedException } from '@exceptions/access-denied.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.checkExistByEmail(
      createUserDto.email,
    );

    if (userExists) throw new ExistsException(MessageName.USER);

    // Hash password
    const hash = this.hashData(createUserDto.password);

    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return {
      ...tokens,
      user: newUser,
    };
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new NotFoundException(MessageName.USER);

    const passwordMatches = user.comparePassword(data.password);
    if (!passwordMatches) throw new IncorrectException(MessageName.USER);

    const tokens = await this.getTokens(user.id, user.username);
    delete user.password;
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async logout(userId: number) {
    this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new AccessDeniedException();

    const refreshTokenMatches = bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new AccessDeniedException();

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hashSync(data, 10);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>(JWT_TYPE.JWT_ACCESS_SECRET),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>(JWT_TYPE.JWT_REFRESH_SECRET),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}