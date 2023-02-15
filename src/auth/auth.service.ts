import * as bcrypt from 'bcrypt';
import { MessageName } from '@/common/message';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserRepository } from '@/users/user.repository';
import { UsersService } from '@/users/users.service';
import { ExistsException } from '@exceptions/exists.exeption';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_TYPE } from '@constants/jwt.type';
import { AuthDto } from './dto/auth.dto';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { AccessDeniedException } from '@exceptions/access-denied.exception';
import { StripeService } from '@/stripe/stripe.service';
import { CustomerService } from '@/customer/customer.service';
import { CreateCustomerDto } from '@/customer/dto/create-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly customerService: CustomerService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.checkExistByEmail(
      createUserDto.email,
    );
    if (userExists) throw new ExistsException(MessageName.USER);

    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: this.hashData(createUserDto.password),
    });
    if (!newUser) throw new ConflictException(`Not Create User`);

    // Create Customer Stripe
    const stripeCustomer = await this.stripeService.createCustomer({
      name: newUser.name,
      email: newUser.email,
      description: 'Create customer strip',
    });
    if (!stripeCustomer)
      throw new ConflictException('Stripe customer not created!');

    // Create customer
    const customer = this.customerService.createCustomer({
      user: newUser,
      balance: stripeCustomer.balance,
      created: stripeCustomer.created,
      currency: stripeCustomer.currency,
      description: stripeCustomer.description,
      token: stripeCustomer.id,
    } as CreateCustomerDto);

    const [resultCustomer, resultTokens] = await Promise.all([
      customer,
      this.getTokens(newUser.id, newUser.username),
    ]);

    if (!resultCustomer) throw new ConflictException('Not create customer');

    await this.updateRefreshToken(newUser.id, resultTokens.refreshToken);

    delete resultCustomer.user;
    return {
      token: resultTokens,
      user: newUser,
      customer: resultCustomer,
    };
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new NotFoundException(MessageName.USER);

    const passwordMatches = this.comparePassword(user.password, data.password);
    if (!passwordMatches) throw new IncorrectException(MessageName.USER);

    const tokens = await this.getTokens(user.id, user.username);
    delete user.password;
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      token: tokens,
      user,
    };
  }

  comparePassword(oldPass: string, password: string) {
    return bcrypt.compareSync(password, oldPass);
  }

  async logout(userId: number) {
    await this.usersService.update(userId, { refreshToken: null });
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
          expiresIn: '2d',
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
