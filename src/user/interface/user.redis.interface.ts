export interface UserRedisSetVerificationCode {
  readonly email: string;
  readonly verificationCode: string;
  readonly time: number;
}

export interface UserRedisGetVerificationCode {
  readonly email: string;
}

export interface UserRedisDeleteVerificationCode {
  readonly email: string;
}

export interface UserRedisDeleteToken {
  readonly id: string;
}
