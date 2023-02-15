import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { BankAccountEntity } from './entities/bankAccount.entity';
import { BankCardEntity } from './entities/bankCard.entity';
import { BankLocalEntity } from './entities/bankLocal.entity';
import { CardEntity } from './entities/card.entity';
import { CustomerEntity } from './entities/customer.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TransferEntity } from './entities/transfer.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: 'db-wallet',
        entities: [
          UserEntity,
          BankAccountEntity,
          BankCardEntity,
          BankLocalEntity,
          CardEntity,
          CustomerEntity,
          TransactionEntity,
          TransferEntity,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class MysqlModule {}
