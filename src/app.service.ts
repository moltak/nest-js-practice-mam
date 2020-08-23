import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ParentEntity } from './entity/parent.entity';
import { SitterEntity } from './entity/sitter.entity';
import { UserRole } from './entity/user.role';
import { SignUpDto } from './dto/SignUpDto';
import { AccessTokenDto } from './dto/AccessTokenDto';
import { SignInDto } from './dto/SignInDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { BecomeDto } from './dto/BecomeDto';
import { Gender } from './entity/gender';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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

    const user = await this.usersRepository.save(userEntity);
    const found = await this.usersRepository.findOne(
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

  signUp(signupDto: SignUpDto): Promise<AccessTokenDto> {
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
}
