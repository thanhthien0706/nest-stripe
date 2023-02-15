import { Module, forwardRef } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { StripeModule } from '@/stripe/stripe.module';
import { CardRepository } from './cards.repository';
import { CustomerModule } from '@/customer/customer.module';

@Module({
  imports: [forwardRef(() => StripeModule), CustomerModule],
  providers: [CardsService, CardRepository],
  controllers: [CardsController],
  exports: [CardsService],
})
export class CardsModule {}
