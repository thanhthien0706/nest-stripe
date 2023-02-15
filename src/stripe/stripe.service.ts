import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Customer } from './model/customer.interface';
import { async } from 'rxjs';
import { Deposit } from './model/deposit.interface';
import { WithdrawModel } from './model/withdraw.interface';
import { CreateStripeCustomerDto } from './dto/create-stripe-customer.dto';
import { CreateCardDto } from '@/cards/dto/create-card.dto';
import { CreateCardStripeDto } from './dto/create-card-stripe.dto';
import { DepositDto } from './dto/deposti.dto';
import { CustomerService } from '@/customer/customer.service';
import { UserEntity } from '@/common/database/entities/user.entity';
import { CardsService } from '@/cards/cards.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    readonly configService: ConfigService,
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => CardsService))
    private readonly cardService: CardsService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async createCustomer({
    name,
    email,
    description = 'Create customer stripe',
  }: CreateStripeCustomerDto) {
    return await this.stripe.customers.create({
      name,
      email,
      description,
    });
  }

  async createCardStripe(createCard: CreateCardStripeDto) {
    const cardStripe = await this.stripe.tokens.create({
      card: createCard,
    });

    if (!cardStripe) throw new ConflictException('Not create card');

    return cardStripe;
  }

  async addCardToCustomer(customerToken, cardToken) {
    console.log(customerToken, cardToken);
    const card = await this.stripe.customers.createSource(customerToken, {
      source: cardToken,
    });

    if (!card) throw new ConflictException('Token not create!');

    return card;
  }

  async deposit(
    { amount, currency, description = '' }: DepositDto,
    { id }: UserEntity,
  ) {
    const customer = await this.customerService.getCustomeByUserId(id);

    const card = await this.cardService.getCardByIdCustomer(customer.id);

    const deposit = await this.stripe.charges.create({
      amount,
      currency,
      customer: customer.token,
      source: card.token,
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
      source_type,
    });

    if (!withdraw) throw new ConflictException();

    return withdraw;
  }
}
