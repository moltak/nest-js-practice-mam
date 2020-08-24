import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('User Controller', () => {
  let controller: UserController;

  const userService: jest.Mocked<any> = {
    user: jest.fn(),
  };

  const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const jwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: 'UserService', useValue: userService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
