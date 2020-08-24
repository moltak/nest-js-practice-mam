import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entity/user.role';

export class BecomeDto {
  @IsEnum(UserRole, {
    message: '유저 권한이 올바르지 않습니다.',
  })
  userRole: UserRole;

  @IsOptional()
  @IsString()
  selfIntroduction: string;

  @IsOptional()
  @IsNumber()
  minimumCareAge: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  careAge: number;
}
