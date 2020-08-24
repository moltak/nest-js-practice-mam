import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { ParentEntity } from '../entity/parent.entity';
import { SitterEntity } from '../entity/sitter.entity';
import { Gender } from '../entity/gender';
import { UserRole } from '../entity/user.role';
import { SignUpDto } from '../dto/SignUpDto';
import { AccessTokenDto } from '../dto/AccessTokenDto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dto/SignInDto';
import { BecomeDto } from '../dto/BecomeDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ParentEntity)
    private parentRepository: Repository<ParentEntity>,
    @InjectRepository(SitterEntity)
    private sitterRepository: Repository<SitterEntity>,
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

  async signUp(signupDto: SignUpDto): Promise<AccessTokenDto> {
    const hashed = await bcrypt.hash(signupDto.password, 10);
    throw new Error('Method not implemented.');
  }

  signIn(signInDto: SignInDto): Promise<AccessTokenDto> {
    throw new Error('Method not implemented.');
  }

  getUser(userId: number): Promise<any> {
    throw new Error('Method not implemented.');
  }

  become(becomeDto: BecomeDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  updateUser(updateUserDto: UpdateUserDto): Promise<string> {
    throw new Error('Method not implemented.');
  }

  userById(userId: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
