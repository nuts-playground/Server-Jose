import * as uuid_1 from 'uuid';

export class UUIDUtil {
  static generate(): string {
    return uuid_1.v4();
  }
}
