import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async test(): Promise<object> {
    return { Test: 'JSON' };
  }
}
