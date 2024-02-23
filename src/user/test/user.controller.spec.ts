import { UserController } from '../user.controller';
import { Test } from '@nestjs/testing';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('이메일 유효성 검사', () => {});
});
