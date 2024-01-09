import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { bcrypt_compare } from 'src/common/utils/bcrypt.util';
import { findByEmail } from 'src/common/utils/prisma.util';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email;
    const password = request.body.password;
    const user = await findByEmail(email);

    if (user) {
      const isPassword = await bcrypt_compare(password, user.password);
      if (isPassword) {
        return super.canActivate(context) as boolean;
      }
    }

    throw new UnauthorizedException(
      '이메일 또는 비밀번호가 일치하지 않습니다.',
    );
  }
}
