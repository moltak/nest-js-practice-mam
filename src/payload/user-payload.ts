import { Gender } from '../entity/gender';
import { UserRole } from '../entity/user.role';
import { UserEntity } from '../entity/user.entity';
import { SitterPayload } from './sitter-payload';
import { ParentPayload } from './parent-payload';

export class UserPayload {
  constructor(user: UserEntity) {
    this.name = user.name;
    this.birthDate = user.birthDate;
    this.gender = user.gender;
    this.userId = user.userId;
    this.email = user.email;
    this.userRole = user.userRole;

    if (user.sitters) {
      this.sitter = new SitterPayload(user.sitters[0]);
    }

    if (user.parents) {
      this.parent = new ParentPayload(user.parents[0]);
    }
  }

  name: string;
  birthDate: string;
  gender: Gender;
  userId: string;
  email: string;
  userRole: UserRole;
  sitter: SitterPayload;
  parent: ParentPayload;
}
