import { BaseEntity } from '@/common/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('cards')
export class CardEntity extends BaseEntity {
  @Column()
  token: string;

  @Column()
  brand: string;

  @Column()
  country: string;

  @Column()
  exp_month: number;

  @Column()
  exp_year: number;

  @Column()
  codeCard: string;

  @Column()
  cvc: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.cards)
  customer: CustomerEntity;
}
