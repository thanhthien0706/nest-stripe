import { Global, Module } from '@nestjs/common';
import { ReponseService } from './reponse.service';

@Global()
@Module({
  providers: [ReponseService],
  exports: [ReponseService],
})
export class BaseModule {}
