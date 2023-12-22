import { Controller, Get, Patch, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import {
  ValidateSignIn,
  ValidateSignUp,
} from 'src/user/decorator/user.decorator';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {}

  /**
   * Sign up a user.
   *
   * @param dto - The sign up data.
   * @returns A promise that resolves to a ResponseDto.
   */
  @Post('/signUp')
  async signUp(@ValidateSignUp() dto: SignUpDto): Promise<ResponseDto> {
    return await this.userService.signUp(dto);
  }

  /**
   * Sign in with the provided credentials.
   *
   * @param dto - The sign-in data.
   * @returns A promise that resolves to the result of the sign-in operation.
   */
  @Post('/signIn')
  async signIn(@ValidateSignIn() dto: SignInDto): Promise<any> {
    return await this.userService.signIn(dto);
  }

  // TODO: Create DTO for the following methods
  @Post('/sendVerificationCode')
  async sendVerificationCode(@Body() dto): Promise<any> {
    return await this.userService.sendVerificationCode(dto.email);
  }

  // TODO: Create DTO for the following methods
  @Post('/verifyEmail')
  async verifyEmail(@Body() dto): Promise<any> {
    return await this.userService.verifyEmail(dto.email, dto.verificationsCode);
  }

  @Patch()
  async patch() {
    return await this.userService.patch();
  }

  @Get('/')
  async test() {
    const redisClient = this.redisService.getRedisClient();
    await redisClient.set('test', 'zz');
    const rs = await redisClient.get('test');
    console.log(rs);
  }
}
