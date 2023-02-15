import { Module, forwardRef } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { CustomerModule } from '@/customer/customer.module';
import { CardsModule } from '@/cards/cards.module';

@Module({
  imports: [CustomerModule, forwardRef(() => CardsModule)],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
