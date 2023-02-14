import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Customer } from './model/customer.interface';
import { Deposit } from './model/deposit.interface';
import { WithdrawModel } from './model/withdraw.interface';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-customer')
  async createCustomer(@Body() body: { customerInfo: Customer }) {
    try {
      const customer = await this.stripeService.createCustomer(
        body.customerInfo,
      );

      const card = await this.stripeService.createCard(customer.id);

      return card;
    } catch (error) {
      return error;
    }
  }

  @Post('deposit')
  async deposit(@Body() body: { depositInfo: Deposit }) {
    try {
      return await this.stripeService.deposit(body.depositInfo);
    } catch (error) {
      return error;
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
