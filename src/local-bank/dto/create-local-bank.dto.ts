import { IsString } from 'class-validator';

export class CreateLocalBankDto {
  @IsString()
  accountBank: string;
}
