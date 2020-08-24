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
import { GetUserPayload } from '../payload/get-user-payload';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Put('/:userId')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: number,
  ): Promise<any> {
    return this.userService.updateUser(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId/become')
  become(
    @Body() becomeDto: BecomeDto,
    @Param('userId') userId: number,
  ): Promise<any> {
    return this.userService.become(becomeDto);
  }

  @UseGuards()
  @Get('/:userId')
  getUser(@Param('userId') userId: string): Promise<GetUserPayload> {
    return this.userService.user(userId);
  }
}
