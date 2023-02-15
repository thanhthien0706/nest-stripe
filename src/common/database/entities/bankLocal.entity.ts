import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('local-banks')
export class BankLocalEntity extends BaseEntity {
  @Column()
  accountBank: string;

  @Column()
  nameBank: string;
}
