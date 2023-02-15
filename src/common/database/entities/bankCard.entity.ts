import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomerEntity } from './customer.entity';

@Entity('bank_cards')
export class BankCardEntity extends BaseEntity {
  @Column()
  token: string;

  @Column()
  account_holder_name: string;

  @Column()
  account_holder_type: string;

  @Column()
  bank_name: string;

  @Column()
  country: string;

  @Column()
  currency: string;

  @Column()
  routing_number: string;

  @Column()
  codeCard: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.bankCard)
  customer: CustomerEntity;
}
