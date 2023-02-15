import { ReponseService } from '@/base/reponse.service';
import { AccessTokenGuard } from '@guards/access-token.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsService } from './cards.service';
import { UserEntity } from '@/common/database/entities/user.entity';
import { CreateCardStripeDto } from '@/stripe/dto/create-card-stripe.dto';

@Controller('cards')
@UseGuards(AccessTokenGuard)
export class CardsController {
  constructor(
    private readonly cardService: CardsService,
    private readonly reponseService: ReponseService,
  ) {}

  @Post('add-to-customer')
  async createCardsAndAddToCustomer(
    @Body() createCardStripe: CreateCardStripeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.cardService.createAndAddToCustomer(
        req.user as UserEntity,
        createCardStripe,
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
}
