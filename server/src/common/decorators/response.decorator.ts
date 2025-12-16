import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'RESPONSE_MESSAGE';

export default function ResponseMessage(message: string) {
  return SetMetadata(RESPONSE_MESSAGE_KEY, message);
}
