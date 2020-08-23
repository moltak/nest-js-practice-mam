import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { SignUpDto } from './dto/SignUpDto';
import { SignInDto } from './dto/SignInDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { BecomeDto } from './dto/BecomeDto';
import { AccessTokenDto } from './dto/AccessTokenDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/users/signup')
  signUp(@Body() signupDto: SignUpDto): Promise<AccessTokenDto> {
    return this.appService.signUp(signupDto);
  }

  @Post('/users/signin')
  signIn(@Body() signInDto: SignInDto): Promise<AccessTokenDto> {
    return this.appService.signIn(signInDto);
  }

  @Put('/users/:userId')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: number,
  ): Promise<any> {
    return this.appService.updateUser(updateUserDto);
  }

  @Put('/users/:userId/become')
  become(
    @Body() becomeDto: BecomeDto,
    @Param('userId') userId: number,
  ): Promise<any> {
    return this.appService.become(becomeDto);
  }

  @Get('/users/:userId')
  getUser(@Param('userId') userId: number): Promise<string> {
    return this.appService.getUser(userId);
  }
}
