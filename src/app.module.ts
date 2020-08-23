import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ParentEntity } from './entity/parent.entity';
import { SitterEntity } from './entity/sitter.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, ParentEntity, SitterEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
