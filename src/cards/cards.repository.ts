import { CardEntity } from '@/common/database/entities/card.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CardRepository extends Repository<CardEntity> {
  constructor(private dataSource: DataSource) {
    super(CardEntity, dataSource.createEntityManager());
  }

  async getCardByCustomerId(idCus: number) {
    return await this.findOneBy({
      customer: { id: idCus },
    });
  }
}
