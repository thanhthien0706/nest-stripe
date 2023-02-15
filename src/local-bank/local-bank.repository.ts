import { BankAccountEntity } from '@/common/database/entities/bankAccount.entity';
import { BankLocalEntity } from '@/common/database/entities/bankLocal.entity';
import { CustomerEntity } from '@/common/database/entities/customer.entity';
import { UserEntity } from '@/common/database/entities/user.entity';
import { MessageName } from '@/common/message';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class LocalBankRepository extends Repository<BankLocalEntity> {
  constructor(private dataSource: DataSource) {
    super(BankLocalEntity, dataSource.createEntityManager());
  }
}
