import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
import { prismaUtil } from 'src/common/utils/prisma.util';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email;
    const password = request.body.password;
    const user = await prismaUtil().findByEmail(email);

    if (user) {
      const isPassword = await bcryptUtil().compare({
        password,
        hash: user.password,
      });

      if (isPassword) {
        return super.canActivate(context) as boolean;
      }
    }

    throw new UnauthorizedException(
      '이메일 또는 비밀번호가 일치하지 않습니다.',
    );
  }
}
