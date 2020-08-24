import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParentEntity } from '../entity/parent.entity';
import { SitterEntity } from '../entity/sitter.entity';
import { SignUpDto } from '../dto/SignUpDto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SignInDto } from '../dto/SignInDto';
import { BecomeDto } from '../dto/BecomeDto';

describe('UserService', () => {
  let service: UserService;

  const authService: jest.Mocked<any> = {
    login: jest.fn(),
  };

  const userRepository: jest.Mocked<any> = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const parentRepository: jest.Mocked<any> = {};

  const sitterRepository: jest.Mocked<any> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'AuthService',
          useValue: authService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(ParentEntity),
          useValue: parentRepository,
        },
        {
          provide: getRepositoryToken(SitterEntity),
          useValue: SitterEntity,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('회원가입 후 accesstoken 반환해야함', async () => {
    // given
    const dto = new SignUpDto();

    authService.login.mockImplementation(() => {
      return {
        accessToken: 'DUMMY_ACCESS_TOKEN',
      };
    });

    // when
    const res = await service.signUp(dto);

    // then
    expect(res.accessToken).not.toBeNull();
  });

  it('중복된 이메일이 있을 경우 - throw exception', async () => {
    // given
    const dto = new SignUpDto();

    userRepository.findOne.mockImplementation(() => {
      return {};
    });

    // when then
    await expect(service.signUp(dto)).rejects.toThrowError(BadRequestException);
  });

  it('중복된 userId가 있을 경우 - throw exception', async () => {
    // given
    const dto = new SignUpDto();

    userRepository.findOne.mockImplementation(() => {
      return {};
    });

    // when then
    await expect(service.signUp(dto)).rejects.toThrowError(BadRequestException);
  });

  it('로그인 되었을 경우 accessToken 반환해야함', async () => {
    // given
    const dto = new SignInDto('DUMMY_USER_ID', 'DUMMY_PASSWORD');

    // when
    const res = await service.signIn(dto);

    // then
    expect(res.accessToken).not.toBeNull();
  });

  it('유저 정보 반환', async () => {
    // given
    const DUMMY_USER_ID = 'DUMMY_USER_ID';
    userRepository.findOne.mockImplementation(() => {
      return {
        userId: DUMMY_USER_ID,
      };
    });

    // when
    const res = await service.user(DUMMY_USER_ID);

    // then
    expect(res.userId).toEqual(DUMMY_USER_ID);
  });

  it('유저 정보 반환 - 유저 못 찾음 - throw exception', async () => {
    // given
    const DUMMY_USER_ID = 'DUMMY_USER_ID';
    userRepository.findOne.mockImplementation(() => {
      return null;
    });

    // when
    await expect(service.user(DUMMY_USER_ID)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('유저 부모 되기', async () => {
    // given
    const dto = new BecomeDto();
    // when
    // then
  });

  it('유저 시터 되기', async () => {
    // given
    // when
    // then
  });

  it('유저 부모, 시터 정보 부족', async () => {
    // given
    // when
    // then
  });

  it('유저 정보 변경', async () => {
    // given
    // when
    // then
  });
});
