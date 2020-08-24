import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParentEntity } from '../entity/parent.entity';
import { SitterEntity } from '../entity/sitter.entity';
import { SignUpDto } from '../dto/sign-up-dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in-dto';
import { BecomeDto } from '../dto/become-dto';
import { UserRole } from '../entity/user.role';
import { Gender } from '../entity/gender';
import { UpdateUserDto } from '../dto/update-user-dto';

describe('UserService', () => {
  let service: UserService;

  const authService: jest.Mocked<any> = {
    login: jest.fn(),
  };

  const userRepository: jest.Mocked<any> = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

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

  it('유저 부모나 시터 되기 - 실패 - 유저 없음', async () => {
    await expect(
      service.become('DUMMY_USER_ID', new BecomeDto()),
    ).rejects.toThrow(NotFoundException);
  });

  it('유저 부모 되기', async () => {
    // given
    const DUMMY_USER_ID = 0;
    const CARE_AGE = 4;
    const DUMMY_DESCRIPTION = 'DUMMY_DESCRIPTION';

    const dto = new BecomeDto();
    dto.careAge = CARE_AGE;
    dto.description = DUMMY_DESCRIPTION;
    dto.userRole = UserRole.PARENT;

    userRepository.findOne.mockImplementation(() => {
      return {
        id: DUMMY_USER_ID,
      };
    });

    userRepository.save.mockImplementation(() => {
      return {
        name: 'DUMMY_NAME',
        birthDate: 'DUMMY_BIRTH_DATE',
        gender: Gender.FEMALE,
        userId: 'DUMMY_USER_ID',
        email: 'DUMMY_EMAIL',
        userRole: UserRole.PARENT,
      };
    });

    // when
    await service.become('DUMMY_USER_ID', dto);

    // then
    expect(userRepository.save).toHaveBeenCalledWith({
      id: DUMMY_USER_ID,
      parents: [
        {
          careAge: CARE_AGE,
          description: DUMMY_DESCRIPTION,
          userId: DUMMY_USER_ID,
        },
      ],
      userRole: UserRole.PARENT,
    });
  });

  it('유저 시터 되기', async () => {
    // given
    const DUMMY_USER_ID = 0;
    const DUMMY_MINIMUM_CARE_AGE = 3;
    const DUMMY_SELF_INTRODUCTION = 'DUMMY_SELF_INTRODUCTION';

    const dto = new BecomeDto();
    dto.minimumCareAge = DUMMY_MINIMUM_CARE_AGE;
    dto.selfIntroduction = DUMMY_SELF_INTRODUCTION;
    dto.userRole = UserRole.SITTER;

    userRepository.findOne.mockImplementation(() => {
      return {
        id: DUMMY_USER_ID,
      };
    });

    userRepository.save.mockImplementation(() => {
      return {
        name: 'DUMMY_NAME',
        birthDate: 'DUMMY_BIRTH_DATE',
        gender: Gender.FEMALE,
        userId: 'DUMMY_USER_ID',
        email: 'DUMMY_EMAIL',
        userRole: UserRole.SITTER,
      };
    });

    // when
    await service.become('DUMMY_USER_ID', dto);

    // then
    expect(userRepository.save).toHaveBeenCalledWith({
      id: DUMMY_USER_ID,
      sitters: [
        {
          minimumCareAge: DUMMY_MINIMUM_CARE_AGE,
          selfIntroduction: DUMMY_SELF_INTRODUCTION,
          userId: DUMMY_USER_ID,
        },
      ],
      userRole: UserRole.SITTER,
    });
  });

  it('유저가 부모가 되고 싶음', async () => {
    // given
    const user = new UserEntity();
    user.userRole = UserRole.USER;

    // when
    const res = service.becomeASomething(user, UserRole.PARENT);

    // then
    expect(res).toEqual(UserRole.PARENT);
  });

  it('부모가 시터도 하고 싶음', async () => {
    // given
    const parent = new UserEntity();
    parent.userRole = UserRole.PARENT;

    // when
    const res = service.becomeASomething(parent, UserRole.SITTER);

    // then
    expect(res).toEqual(UserRole.BOTH);
  });

  it('시터가 부모도 하고 싶음', async () => {
    // given
    const sitter = new UserEntity();
    sitter.userRole = UserRole.SITTER;

    // when
    const res = service.becomeASomething(sitter, UserRole.PARENT);

    // then
    expect(res).toEqual(UserRole.BOTH);
  });

  it('시터이면서 부모일 땐, role 변경 안됨', () => {
    // given
    const both = new UserEntity();
    both.userRole = UserRole.BOTH;

    // when
    const res = service.becomeASomething(both, UserRole.SITTER);

    // then
    expect(res).toEqual(UserRole.BOTH);
  });

  it('유저 정보 변경 - 유저 못 찾았음', async () => {
    // given
    const dto = new UpdateUserDto();

    userRepository.findOne.mockImplementation(() => {
      return null;
    });

    // when
    await expect(service.updateUser('DUMMY_USER_ID', dto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
