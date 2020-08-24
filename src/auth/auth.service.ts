import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
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
    const payload = { sub: user.userId, role: user.userRole };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
