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
import { StripeService } from './stripe.service';
import { Customer } from './model/customer.interface';
import { Deposit } from './model/deposit.interface';
import { WithdrawModel } from './model/withdraw.interface';
import { Request, Response } from 'express';
import { ReponseService } from '@/base/reponse.service';
import { DepositDto } from './dto/deposti.dto';
import { AccessTokenGuard } from '@guards/access-token.guard';
import { UserEntity } from '@/common/database/entities/user.entity';

@Controller('stripe')
@UseGuards(AccessTokenGuard)
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly reponseService: ReponseService,
  ) {}

  // @Post('create-customer')
  // async createCustomer(@Body() body: { customerInfo: Customer }) {
  //   try {
  //     const customer = await this.stripeService.createCustomer(
  //       body.customerInfo,
  //     );

  //     const card = await this.stripeService.addCardToCustomer(customer.id);

  //     return card;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  @Post('deposit')
  async deposit(
    @Body() creatDeposit: DepositDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.stripeService.deposit(
        creatDeposit,
        req.user as UserEntity,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          this.reponseService.customResponeHttp(
            true,
            'Create card and add to customer successful',
            data,
            req.url,
          ),
        );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('withdraw')
  async withdraw(@Body() body: { withdraw: WithdrawModel }) {
    try {
      return await this.stripeService.withdraw(body.withdraw);
    } catch (error) {
      return error;
    }
  }

  @Post('transfer')
  async transfer() {
    try {
    } catch (error) {
      return error;
    }
  }

  @Post('testing')
  async testingApi() {
    try {
    } catch (error) {
      return error;
    }
  }
}
