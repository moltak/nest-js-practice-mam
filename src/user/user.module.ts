import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { SitterEntity } from '../entity/sitter.entity';
import { ParentEntity } from '../entity/parent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SitterEntity, ParentEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
