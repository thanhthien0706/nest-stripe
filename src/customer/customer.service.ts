import { ConflictException, Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CustomerEntity } from '@/common/database/entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UserEntity } from '@/common/database/entities/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { NotFoundException } from '@exceptions/not-found.exception';
import { MessageName } from '@/common/message';
import { BankLocalEntity } from '@/common/database/entities/bankLocal.entity';

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

  async getCustomerById(id: number) {
    const customer = await this.customerRepository.findOneById(id);

    if (!customer) throw new NotFoundException(MessageName.USER);

    return customer;
  }

  async addLocalBank(localBank: string, { id }: UserEntity) {
    const customer = await this.getCustomeByUserId(id);

    const updated = Object.assign(customer, {
      localBank: localBank,
    });

    return await this.customerRepository.save(updated);
  }

  async plusBalance(amount: number, customer: CustomerEntity) {
    const updated = Object.assign(customer, {
      balance: customer.balance + amount,
    });

    return await this.customerRepository.save(updated);
  }

  async minusBalance(amount: number, customer: CustomerEntity) {
    const updated = Object.assign(customer, {
      balance: customer.balance - amount,
    });

    return await this.customerRepository.save(updated);
  }
}
