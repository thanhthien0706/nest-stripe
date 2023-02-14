import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Customer } from './model/customer.interface';
import { async } from 'rxjs';
import { Deposit } from './model/deposit.interface';
import { WithdrawModel } from './model/withdraw.interface';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async createCustomer({ name, email, description }: Customer) {
    const customer = await this.stripe.customers.create({
      name,
      email,
      description,
    });

    if (!customer) throw new ConflictException('Token not create!');

    return customer;
  }

  async createCard(customerId) {
    const card = await this.stripe.customers.createSource(customerId, {
      source: 'tok_visa',
    });

    if (!card) throw new ConflictException('Token not create!');

    return card;
  }

  async deposit({
    amount,
    currency = 'vnd',
    customer,
    source,
    description = '',
  }: Deposit) {
    const deposit = await this.stripe.charges.create({
      amount,
      currency,
      customer,
      source,
      description,
    });

    if (!deposit) throw new ConflictException('');
    return deposit;
  }

  async withdraw({
    amount,
    currency = 'vnd',
    destination,
    source_type = 'card',
  }: WithdrawModel) {
    const withdraw = await this.stripe.transfers.create({
      amount,
      currency,
      destination,
      source_type: 'card',
    });

    if (!withdraw) throw new ConflictException();

    return withdraw;
  }
}
