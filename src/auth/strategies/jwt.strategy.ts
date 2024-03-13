import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  JwtStrategyDto,
  JwtStrategyValueInterface,
} from '../interface/jwt.strategy.interface';
import { ConfigGlobal } from 'src/config.global';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;
          if (request && request.cookies && request.cookies['access_token']) {
            token = request.cookies['access_token'];
          } else {
            throw new UnauthorizedException('The token is not valid');
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: ConfigGlobal.env.jwtSecretKeyAccessToken,
    });
  }

  validate(payload: JwtStrategyDto): JwtStrategyValueInterface {
    return { id: payload.sub, email: payload.email };
  }
}
