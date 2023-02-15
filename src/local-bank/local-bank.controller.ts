import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalBankService } from './local-bank.service';
import { ReponseService } from '@/base/reponse.service';
import { Request, Response } from 'express';
import { CreateLocalBankDto } from './dto/create-local-bank.dto';
import { CustomerService } from '@/customer/customer.service';
import { UserEntity } from '@/common/database/entities/user.entity';
import { AccessTokenGuard } from '@guards/access-token.guard';

@Controller('local-bank')
@UseGuards(AccessTokenGuard)
export class LocalBankController {
  constructor(
    private readonly localBankService: LocalBankService,
    private readonly reponseService: ReponseService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  async createLocalBank(
    @Body() creatLocalBank: CreateLocalBankDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.localBankService.creteLocalBank(creatLocalBank);
      await this.customerService.addLocalBank(
        data.accountBank,
        req.user as UserEntity,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          this.reponseService.customResponeHttp(
            true,
            'Create local bank successful',
            data,
            req.url,
          ),
        );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
