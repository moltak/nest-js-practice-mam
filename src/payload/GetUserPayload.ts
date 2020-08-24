import { Gender } from '../entity/gender';
import { UserRole } from '../entity/user.role';
import { UserEntity } from '../entity/user.entity';

export class GetUserPayload {
  constructor(user: UserEntity) {
    this.name = user.name;
    this.birthDate = user.birthDate;
    this.gender = user.gender;
    this.userId = user.userId;
    this.email = user.email;
    this.userRole = user.userRole;
  }

  name: string;
  birthDate: string;
  gender: Gender;
  userId: string;
  email: string;
  userRole: UserRole;
}
