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
import { Gender } from '../entity/gender';
import { UserRole } from '../entity/user.role';
import { SignUpDto } from '../dto/SignUpDto';
import { AccessTokenPayload } from '../payload/AccessTokenPayload';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dto/SignInDto';
import { BecomeDto } from '../dto/BecomeDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { AuthService } from '../auth/auth.service';
import { GetUserPayload } from '../payload/GetUserPayload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ParentEntity)
    private parentRepository: Repository<ParentEntity>,
    @InjectRepository(SitterEntity)
    private sitterRepository: Repository<SitterEntity>,
    private authService: AuthService,
  ) {}

  async getHello(): Promise<string> {
    const userEntity = new UserEntity();
    userEntity.name = 'aaaa';
    userEntity.birthDate = '00';
    userEntity.gender = Gender.FEMALE;
    userEntity.userId = 'userId';
    userEntity.password = 'password';
    userEntity.email = 'aaaa@email.com';
    userEntity.userRole = UserRole.NONE;

    const parent = new ParentEntity();
    const sitter = new SitterEntity();

    userEntity.parents = [parent];
    userEntity.sitters = [sitter];

    const user = await this.userRepository.save(userEntity);
    const found = await this.userRepository.findOne(
      { id: user.id },
      { relations: ['parents', 'sitters'] },
    );
    console.log(found.sitters);
    console.log(found.parents);

    console.log(
      (await this.parentRepository.find({ relations: ['user'] })).map(
        i => i.user.id,
      ),
    );

    console.log(
      (await this.sitterRepository.find({ relations: ['user'] })).map(
        i => i.user.id,
      ),
    );

    return 'Hello World!';
  }

  async signUp(signupDto: SignUpDto): Promise<AccessTokenPayload> {
    if (await this.userRepository.findOne({ userId: signupDto.userId })) {
      throw new BadRequestException('중복된 아이디입니다.');
    }

    if (await this.userRepository.findOne({ email: signupDto.email })) {
      throw new BadRequestException('중복된 이메일입니다.');
    }

    const userEntity = new UserEntity();
    userEntity.name = signupDto.name;
    userEntity.birthDate = signupDto.birthDate;
    userEntity.gender = signupDto.gender;
    userEntity.userId = signupDto.userId;
    userEntity.email = signupDto.email;
    userEntity.userRole = signupDto.userRole;
    userEntity.password = await bcrypt.hash(signupDto.password, 10);

    const saved = await this.userRepository.save(userEntity);

    const token = await this.authService.login(saved);

    return new AccessTokenPayload(token.accessToken);
  }

  async signIn(signInDto: SignInDto): Promise<AccessTokenPayload> {
    const user = await this.userRepository.findOne({
      userId: signInDto.userId,
    });

    const token = await this.authService.login(user);

    return new AccessTokenPayload(token.accessToken);
  }

  async user(userId: string): Promise<GetUserPayload> {
    const user = await this.userRepository.findOne({ userId });

    if (!user) {
      throw new NotFoundException('가입 정보가 없습니다.');
    }

    return new GetUserPayload(user);
  }

  async become(becomeDto: BecomeDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async userById(userId: string): Promise<UserEntity> {
    return this.userRepository.findOne({ userId });
  }
}
