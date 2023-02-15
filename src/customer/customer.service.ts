import { ConflictException, Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CustomerEntity } from '@/common/database/entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UserEntity } from '@/common/database/entities/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { NotFoundException } from '@exceptions/not-found.exception';
import { MessageName } from '@/common/message';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(
    customerCreate: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return await this.customerRepository.save(customerCreate);
  }

  async getIdByUserId(userId: number): Promise<number> {
    const customer = await this.customerRepository.findCustomerByUser(userId);

    if (!customer)
      throw new ConflictException(`User with id ${userId} not found`);

    return customer.id;
  }

  async getCustomeByUserId(userId: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findCustomerByUser(userId);

    if (!customer)
      throw new ConflictException(`User with id ${userId} not found`);

    return customer;
  }
}
