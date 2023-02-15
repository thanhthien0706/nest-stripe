import { UserEntity } from '@/common/database/entities/user.entity';
import { IsNumber, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  token: string;

  user: UserEntity;

  @IsNumber()
  balance: number;

  @IsNumber()
  created: number;

  @IsString()
  currency: string;

  @IsString()
  description: string;
}
