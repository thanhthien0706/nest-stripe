import { ForbiddenException } from '@nestjs/common';
import { MessageError } from '../message';

export class AccessDeniedException extends ForbiddenException {
  constructor() {
    super(MessageError.ACCESS_DENIED());
  }
}
