import { UserRole } from '../entity/user.role';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}
