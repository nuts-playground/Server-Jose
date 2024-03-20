import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { globalBcryptUtil } from 'src/common/utils/bcrypt.util';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor(private readonly userRepository: UserRepositoryService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email;
    const password = request.body.password;

    const user = await this.userRepository.findByEmail({ email });

    if (user) {
      const isPassword = await globalBcryptUtil.compare({
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
