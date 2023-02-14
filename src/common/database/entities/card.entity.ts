import { BaseEntity } from '@/common/database/entities/base.entity';
import { Entity } from 'typeorm';

@Entity('cards')
export class CustomerEntity extends BaseEntity {}
