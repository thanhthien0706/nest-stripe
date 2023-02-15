import { BaseEntity } from '@/common/database/entities/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { CardEntity } from './card.entity';
import { BankCardEntity } from './bankCard.entity';
import { TransactionEntity } from './transaction.entity';
import { TransferEntity } from './transfer.entity';
import { BankLocalEntity } from './bankLocal.entity';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @Column()
  token: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  balance: number;

  @Column()
  created: number;

  @Column({ nullable: true })
  currency: string;

  @Column()
  description: string;

  @OneToMany(() => CardEntity, (card) => card.customer)
  cards: CardEntity[];

  @OneToMany(() => BankCardEntity, (backCard) => backCard.customer)
  bankCard: BankCardEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.tokenCus)
  transactions: TransactionEntity[];

  @OneToMany(() => TransferEntity, (transaction) => transaction.toCus)
  tstTransferTo: TransferEntity[];

  @OneToMany(() => TransferEntity, (transaction) => transaction.fromCus)
  tstTransferfrom: TransferEntity[];

  @Column()
  localBank: string;
}
