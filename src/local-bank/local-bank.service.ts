import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { LocalBankRepository } from './local-bank.repository';
import { CreateLocalBankDto } from './dto/create-local-bank.dto';

@Injectable()
export class LocalBankService {
  constructor(private readonly localBankRepository: LocalBankRepository) {}

  async checkLocalBank(accountBank: string) {
    return await this.localBankRepository.exist({
      where: {
        accountBank,
      },
    });
  }

  async creteLocalBank(createLocal: CreateLocalBankDto) {
    const check = await this.checkLocalBank(createLocal.accountBank);

    if (check) throw new ConflictException('Local bank exists');

    return await this.localBankRepository.save(createLocal);
  }

  async getInfoById(id: number) {
    const bank = await this.localBankRepository.findOneBy({ id });

    if (!bank) throw new BadRequestException('Local Bank not found');

    return bank;
  }
}
