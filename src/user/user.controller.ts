import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from '../dto/SignUpDto';
import { AccessTokenDto } from '../dto/AccessTokenDto';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from '../dto/SignInDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { BecomeDto } from '../dto/BecomeDto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body() signupDto: SignUpDto): Promise<AccessTokenDto> {
    return this.userService.signUp(signupDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signIn(@Body() signInDto: SignInDto): Promise<AccessTokenDto> {
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

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  getUser(@Param('userId') userId: number): Promise<string> {
    return this.userService.getUser(userId);
  }
}
