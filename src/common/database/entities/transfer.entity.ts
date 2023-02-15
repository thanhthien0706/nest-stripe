import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomerEntity } from './customer.entity';

@Entity('transfers')
export class TransferEntity extends BaseEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.tstTransferTo)
  toCus: CustomerEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.tstTransferfrom)
  fromCus: CustomerEntity;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  description: string;
}
