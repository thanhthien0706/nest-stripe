import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CardRepository } from './cards.repository';
import { StripeService } from '@/stripe/stripe.service';
import { UserEntity } from '@/common/database/entities/user.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { CustomerService } from '@/customer/customer.service';
import { CreateCardStripeDto } from '@/stripe/dto/create-card-stripe.dto';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardRepository: CardRepository,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    private readonly customerService: CustomerService,
  ) {}

  async createAndAddToCustomer(
    { id }: UserEntity,
    createCardStripe: CreateCardStripeDto,
  ) {
    const customer = this.customerService.getCustomeByUserId(id);
    const cardStripe = this.stripeService.createCardStripe(createCardStripe);

    const [rsCustomer, rsCardStripe] = await Promise.all([
      customer,
      cardStripe,
    ]);

    const addCardToCustomer = await this.stripeService.addCardToCustomer(
      rsCustomer.token,
      rsCardStripe.id,
    );

    const cardInfo: CreateCardDto = {
      brand: rsCardStripe.card.brand,
      codeCard: rsCardStripe.card.last4,
      country: rsCardStripe.card.country,
      cvc: rsCardStripe.card.cvc_check,
      exp_month: rsCardStripe.card.exp_month,
      exp_year: rsCardStripe.card.exp_year,
      token: addCardToCustomer.id,
      customer: rsCustomer,
    };

    const creatCard = await this.createCard(cardInfo);

    return {
      card: creatCard,
    };
  }

  async createCard(createCard: CreateCardDto) {
    const card = this.cardRepository.save(createCard);

    if (!card) throw new ConflictException('NOt save card');

    return card;
  }

  async getCardByIdCustomer(idCus: number) {
    const card = this.cardRepository.getCardByCustomerId(idCus);

    if (!card)
      throw new ConflictException(`Card with customer id ${idCus} not found`);

    return card;
  }
}
