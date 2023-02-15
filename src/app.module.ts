import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { MysqlModule } from './common/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './base/base.module';
import { CustomerModule } from './customer/customer.module';
import { CardsModule } from './cards/cards.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
