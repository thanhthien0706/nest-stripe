import { IsNumber, IsString } from 'class-validator';

export class CreateStripeCustomerDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  description: string;
}
