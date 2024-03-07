import { Test, TestingModule } from '@nestjs/testing';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CheckEmailDto } from 'src/user/dtos/check-email.dto';
import { RepositoryUserResponse } from 'src/user/interface/repository.interface';
import { UserRedisService } from 'src/user/providers/user-redis.service';
import { UserRepositoryService } from 'src/user/providers/user-repository.service';
import { UserService } from 'src/user/providers/user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepositoryService;
  let userRedis: UserRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositoryService,
          useValue: {
            findByEmail: jest.fn(),
            findByName: jest.fn(),
            findById: jest.fn(),
            saveUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
        {
          provide: UserRedisService,
          useValue: {
            setVerificationCode: jest.fn(),
            getVerificationCode: jest.fn(),
            deleteVerificationCode: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepositoryService>(UserRepositoryService);
    userRedis = module.get<UserRedisService>(UserRedisService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(userRedis).toBeDefined();
  });

  describe('isAlreadyEmail', () => {
    const dto = new CheckEmailDto('hello@example.com');
    const response = ResponseDto.success();
    const repositoryResponse: RepositoryUserResponse = {
      email: 'hello@example.com',
      nick_name: 'helloTest',
      password: 'passwordTest',
    };

    it('이메일이 정상일 때', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(repositoryResponse);

      expect(await userService.isAlreadyEmail(dto)).toBe(response);
    });
  });
});
