import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { globalJwtUtil } from 'src/common/utils/jwt.util';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    await globalJwtUtil.verifyAccessToken(token);

    return super.canActivate(context) as boolean;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.cookies?.access_token;
  }
}
