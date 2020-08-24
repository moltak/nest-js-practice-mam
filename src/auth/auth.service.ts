import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../payload/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, pass: string): Promise<any> {
    const user = await this.userService.userById(userId);

    if (user) {
      const checked = await bcrypt.compareSync(pass, user.password);
      if (checked) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { sub: user.userId, role: user.userRole };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
