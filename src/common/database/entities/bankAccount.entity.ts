import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('bank-accounts')
export class BankAccountEntity extends BaseEntity {
  @Column()
  nameCus: string;

  @Column()
  accountNumber: string;

  @Column()
  balance: number;
}
