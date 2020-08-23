import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator';
import { Gender } from '../entity/gender';
import { UserRole } from '../entity/user.role';

export class SignUpDto {
  @IsString({ message: '아이디가 짧습니다.' })
  @MinLength(2, {})
  name: string;

  @IsString()
  @Length(8, 8, { message: '생일 포멧이 올바르지 않습니다.' })
  birthDate: string;

  @IsEnum(Gender, {
    message: '성별이 올바르지 않습니다.',
  })
  gender: Gender;

  @IsString()
  @MinLength(5, { message: '아이디가 짧습니다.' })
  userId: string;

  @IsString()
  @MinLength(6, { message: '패스워드가 짧습니다.' })
  password: string;

  @IsEmail({}, { message: '이메일 포멧이 올바르지 않습니다.' })
  email: string;

  @IsEnum(UserRole, {
    message: '유저 권한이 올바르지 않습니다.',
  })
  userRole: UserRole;
}
