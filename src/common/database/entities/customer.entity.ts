import { BaseEntity } from '@/common/database/entities/base.entity';
import { Entity } from 'typeorm';

@Entity('customers')
export class CustomerEntity extends BaseEntity {}
