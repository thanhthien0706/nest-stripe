import { BadRequestException } from '@nestjs/common';
import { MessageName, MessageError } from '../message';

export class ExistsException extends BadRequestException {
  constructor(text: MessageName) {
    super(MessageError.EXISTS(text));
  }
}
