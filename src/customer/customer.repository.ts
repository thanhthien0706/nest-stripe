import { CustomerEntity } from '@/common/database/entities/customer.entity';
import { UserEntity } from '@/common/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class CustomerRepository extends Repository<CustomerEntity> {
  constructor(private dataSource: DataSource) {
    super(CustomerEntity, dataSource.createEntityManager());
  }

  async findCustomerByUser(userId: number) {
    return await this.findOne({
      where: {
        user: { id: userId },
      },
    });
  }
}
