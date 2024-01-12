import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { jwtUtil } from 'src/common/utils/jwt.util';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('The token is not valid');
    }

    try {
      await jwtUtil().verifyAccessToken(token);
    } catch (error) {
      throw new UnauthorizedException('The token is not valid');
    }

    return super.canActivate(context) as boolean;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.cookies?.access_token;
  }
}
