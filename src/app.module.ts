import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { MysqlModule } from './common/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './base/base.module';
import { CustomerModule } from './customer/customer.module';
import { CardsModule } from './cards/cards.module';
import { LocalBankModule } from './local-bank/local-bank.module';
import { AccountBankModule } from './account-bank/account-bank.module';

@Module({
  imports: [
    MysqlModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    StripeModule,
    UsersModule,
    AuthModule,
    BaseModule,
    CustomerModule,
    CardsModule,
    LocalBankModule,
    AccountBankModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
