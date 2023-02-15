import { Module } from '@nestjs/common';
import { LocalBankService } from './local-bank.service';
import { LocalBankRepository } from './local-bank.repository';
import { LocalBankController } from './local-bank.controller';
import { CustomerModule } from '@/customer/customer.module';

@Module({
  imports: [CustomerModule],
  providers: [LocalBankService, LocalBankRepository],
  exports: [LocalBankService],
  controllers: [LocalBankController],
})
export class LocalBankModule {}
