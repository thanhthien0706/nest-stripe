import { IsNumber, IsString } from 'class-validator';

export class CreateCardStripeDto {
  @IsString()
  number: string;

  @IsNumber()
  exp_month: string;

  @IsNumber()
  exp_year: string;

  @IsString()
  cvc: string;
}
