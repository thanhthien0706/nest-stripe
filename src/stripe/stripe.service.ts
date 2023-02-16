import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreateStripeCustomerDto } from './dto/create-stripe-customer.dto';
import { CreateCardStripeDto } from './dto/create-card-stripe.dto';
import { DepositDto } from './dto/deposti.dto';
import { CustomerService } from '@/customer/customer.service';
import { UserEntity } from '@/common/database/entities/user.entity';
import { CardsService } from '@/cards/cards.service';
import { Transfer } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { AccountBankService } from '@/account-bank/account-bank.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    readonly configService: ConfigService,
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => CardsService))
    private readonly cardService: CardsService,
    private readonly accountBankService: AccountBankService,
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
    
    const plusBalance = this.customerService.plusBalance(amount, customer);

    const deposit = this.stripe.charges.create({
      amount,
      currency,
      customer: customer.token,
      source: card.token,
      description,
    });

    const [rsPlusBalance, rsDeposit] = await Promise.all([
      plusBalance,
      deposit,
    ]);

    if (!rsPlusBalance) throw new ConflictException('');
    if (!rsDeposit) throw new ConflictException('');

    return deposit;
  }

  async withdraw({ amount }: WithdrawDto, { id }: UserEntity) {
    const adminAccount = await this.accountBankService.getAccountBank(
      '121212adadad',
    );

    const customer = await this.customerService.getCustomeByUserId(id);

    const userAccount = await this.accountBankService.getAccountBank(
      customer.localBank,
    );

    const [rsAdminAccount, rsUserAccount] = await Promise.all([
      adminAccount,
      userAccount,
    ]);

    if (rsAdminAccount.balance < amount) {
      throw new BadRequestException('Admin not enough money!');
    }

    await Promise.all([
      this.accountBankService.minusBalance(amount, rsAdminAccount),
      this.accountBankService.plusBalance(amount, rsUserAccount),
    ]);

    return {
      from: rsAdminAccount.accountNumber,
      to: rsUserAccount.accountNumber,
      amount,
    };
  }

  async transfer({ amount, description, to }: Transfer, { id }: UserEntity) {
    const customerFrom = this.customerService.getCustomeByUserId(id);
    const customerTo = this.customerService.getCustomerById(to);

    const [rsCustomerFrom, rsCustomerTo] = await Promise.all([
      customerFrom,
      customerTo,
    ]);

    if (rsCustomerFrom.balance < amount) {
      throw new BadRequestException('You not enough money!');
    }

    await Promise.all([
      this.customerService.minusBalance(amount, rsCustomerFrom),
      this.customerService.plusBalance(amount, rsCustomerTo),
    ]);

    return {
      from: rsCustomerFrom.token,
      to: rsCustomerTo.token,
      amount,
      description,
    };
  }
}
