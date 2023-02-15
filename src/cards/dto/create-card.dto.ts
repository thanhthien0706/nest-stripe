import { CustomerEntity } from '@/common/database/entities/customer.entity';
import { IsNumber, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  token: string;

  @IsString()
  brand: string;

  @IsString()
  country: string;

  @IsString()
  codeCard: string;

  @IsNumber()
  exp_month: number;

  @IsNumber()
  exp_year: number;

  @IsString()
  cvc: string;

  customer?: CustomerEntity;
}
