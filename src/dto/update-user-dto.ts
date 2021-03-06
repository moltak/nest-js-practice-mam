import { IsEnum, IsString, Length, MinLength, Validate } from 'class-validator';
import { Gender } from '../entity/gender';
import { Optional } from '@nestjs/common';
import { CustomPasswordValidator } from '../validator/custom-password-validator';

export class UpdateUserDto {
  @Optional()
  @IsString({ message: '아이디가 짧습니다.' })
  @MinLength(2, {})
  name?: string;

  @Optional()
  @IsString()
  @Length(8, 8, { message: '생일 포멧이 올바르지 않습니다.' })
  birthDate?: string;

  @Optional()
  @IsEnum(Gender, {
    message: '성별이 올바르지 않습니다.',
  })
  gender?: Gender;

  @Optional()
  @Validate(CustomPasswordValidator)
  password?: string;
}
