import { Injectable } from '@nestjs/common';
import { AccountBankRepository } from './account-bank.repository';
import { BankAccountEntity } from '@/common/database/entities/bankAccount.entity';

@Injectable()
export class AccountBankService {
  constructor(private readonly accountBankRepository: AccountBankRepository) {}

  async getAccountBank(accountNumber: string) {
    return await this.accountBankRepository.findOneBy({
      accountNumber,
    });
  }

  async plusBalance(amount: number, account: BankAccountEntity) {
    const updated = Object.assign(account, {
      balance: account.balance + amount,
    });

    return await this.accountBankRepository.save(updated);
  }

  async minusBalance(amount: number, account: BankAccountEntity) {
    const updated = Object.assign(account, {
      balance: account.balance - amount,
    });

    return await this.accountBankRepository.save(updated);
  }
}
