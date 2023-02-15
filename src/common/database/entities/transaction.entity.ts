import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomerEntity } from './customer.entity';
import { Transaction } from '@enums/transaction';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @OneToMany(() => CustomerEntity, (customer) => customer.transactions)
  tokenCus: string;

  @Column()
  typeTransaction: Transaction;

  @Column({ nullable: true })
  typeCard?: 'card' | 'bank';

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  description: string;
}
