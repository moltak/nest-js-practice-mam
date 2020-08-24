import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { ParentEntity } from '../entity/parent.entity';
import { SitterEntity } from '../entity/sitter.entity';
import { UserRole } from '../entity/user.role';
import { SignUpDto } from '../dto/sign-up-dto';
import { AccessTokenPayload } from '../payload/access-token-payload';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dto/sign-in-dto';
import { BecomeDto } from '../dto/become-dto';
import { UpdateUserDto } from '../dto/update-user-dto';
import { AuthService } from '../auth/auth.service';
import { UserPayload } from '../payload/user-payload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async signUp(dto: SignUpDto): Promise<AccessTokenPayload> {
    if (await this.userRepository.findOne({ userId: dto.userId })) {
      throw new BadRequestException('중복된 아이디입니다.');
    }

    if (await this.userRepository.findOne({ email: dto.email })) {
      throw new BadRequestException('중복된 이메일입니다.');
    }

    const userEntity = new UserEntity();
    userEntity.name = dto.name;
    userEntity.birthDate = dto.birthDate;
    userEntity.gender = dto.gender;
    userEntity.userId = dto.userId;
    userEntity.email = dto.email;
    userEntity.userRole = dto.userRole;
    userEntity.password = await bcrypt.hash(dto.password, 10);

    const saved = await this.userRepository.save(userEntity);

    const token = await this.authService.login(saved);

    return new AccessTokenPayload(token.accessToken);
  }

  async signIn(dto: SignInDto): Promise<AccessTokenPayload> {
    const user = await this.userRepository.findOne({
      userId: dto.userId,
    });

    const token = await this.authService.login(user);

    return new AccessTokenPayload(token.accessToken);
  }

  async user(userId: string): Promise<UserPayload> {
    const user = await this.userRepository.findOne(
      { userId },
      { relations: ['parents', 'sitters'] },
    );

    if (!user) {
      throw new NotFoundException('가입 정보가 없습니다.');
    }

    return new UserPayload(user);
  }

  async become(userId: string, dto: BecomeDto): Promise<UserPayload> {
    const user = await this.userRepository.findOne({ userId });

    if (!user) {
      throw new NotFoundException('가입 정보가 없습니다.');
    }

    if (dto.userRole === UserRole.PARENT) {
      const parent = new ParentEntity();
      parent.userId = user.id;
      parent.careAge = dto.careAge;
      parent.description = dto.description;

      user.parents = [parent];
    } else if (dto.userRole === UserRole.SITTER) {
      const sitter = new SitterEntity();
      sitter.userId = user.id;
      sitter.minimumCareAge = dto.minimumCareAge;
      sitter.selfIntroduction = dto.selfIntroduction;

      user.sitters = [sitter];
    }

    user.userRole = this.becomeASomething(user, dto.userRole);

    return new UserPayload(await this.userRepository.save(user));
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserPayload> {
    const user = await this.userRepository.findOne({ userId });

    if (!user) {
      throw new NotFoundException('가입 정보가 없습니다.');
    }

    if (dto.name) {
      user.name = dto.name;
    }

    if (dto.birthDate) {
      user.birthDate = dto.birthDate;
    }

    if (dto.gender) {
      user.gender = dto.gender;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    return new UserPayload(await this.userRepository.save(user));
  }

  async userById(userId: string): Promise<UserEntity> {
    return this.userRepository.findOne({ userId });
  }

  becomeASomething(user: UserEntity, wannaBe: UserRole): UserRole {
    if (user.userRole === UserRole.BOTH) {
      return UserRole.BOTH;
    }

    if (user.userRole === UserRole.PARENT && wannaBe === UserRole.SITTER) {
      return UserRole.BOTH;
    }

    if (user.userRole === UserRole.SITTER && wannaBe === UserRole.PARENT) {
      return UserRole.BOTH;
    }

    return wannaBe;
  }
}
