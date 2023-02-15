import { IsNumber, IsString } from 'class-validator';

export class Transfer {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsNumber()
  to: number;
}
