import { Module } from '@nestjs/common';
import { AccountBankService } from './account-bank.service';
import { AccountBankRepository } from './account-bank.repository';

@Module({
  providers: [AccountBankService, AccountBankRepository],
  exports: [AccountBankService],
})
export class AccountBankModule {}
