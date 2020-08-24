import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  constructor(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
  }

  @IsString()
  @MinLength(5, { message: '아이디가 짧습니다.' })
  userId: string;

  @IsString()
  @MinLength(6, { message: '패스워드가 짧습니다.' })
  password: string;
}
