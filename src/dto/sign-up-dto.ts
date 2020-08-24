import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  MinLength,
  Validate,
} from 'class-validator';
import { Gender } from '../entity/gender';
import { UserRole } from '../entity/user.role';
import { CustomPasswordValidator } from '../validator/custom-password-validator';

export class SignUpDto {
  constructor(
    name: string = 'name',
    birthDate: string = 'YYYYMMDD',
    gender: Gender = Gender.FEMALE,
    userId: string = 'userId',
    password: string = 'password',
    email: string = 'email',
    userRole: UserRole = UserRole.USER,
  ) {
    this.name = name;
    this.birthDate = birthDate;
    this.gender = gender;
    this.userId = userId;
    this.password = password;
    this.email = email;
    this.userRole = userRole;
  }

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
  @Validate(CustomPasswordValidator)
  password: string;

  @IsEmail({}, { message: '이메일 포멧이 올바르지 않습니다.' })
  email: string;

  @IsEnum(UserRole, {
    message: '유저 권한이 올바르지 않습니다.',
  })
  userRole: UserRole;
}
