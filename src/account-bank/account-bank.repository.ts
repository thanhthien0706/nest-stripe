import { BankAccountEntity } from '@/common/database/entities/bankAccount.entity';
import { CustomerEntity } from '@/common/database/entities/customer.entity';
import { UserEntity } from '@/common/database/entities/user.entity';
import { MessageName } from '@/common/message';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class AccountBankRepository extends Repository<BankAccountEntity> {
  constructor(private dataSource: DataSource) {
    super(BankAccountEntity, dataSource.createEntityManager());
  }
}
