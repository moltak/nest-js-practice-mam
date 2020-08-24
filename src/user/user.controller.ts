import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from '../dto/sign-up-dto';
import { AccessTokenPayload } from '../payload/access-token-payload';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from '../dto/sign-in-dto';
import { UpdateUserDto } from '../dto/update-user-dto';
import { BecomeDto } from '../dto/become-dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPayload } from '../payload/user-payload';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  getUser(@Param('userId') userId: string): Promise<UserPayload> {
    return this.userService.user(userId);
  }

  @Post('/signup')
  signUp(@Body() signupDto: SignUpDto): Promise<AccessTokenPayload> {
    return this.userService.signUp(signupDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signIn(@Body() signInDto: SignInDto): Promise<AccessTokenPayload> {
    return this.userService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId/become')
  become(
    @Param('userId') userId: string,
    @Body() becomeDto: BecomeDto,
  ): Promise<UserPayload> {
    return this.userService.become(userId, becomeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPayload> {
    return this.userService.updateUser(userId, updateUserDto);
  }
}
