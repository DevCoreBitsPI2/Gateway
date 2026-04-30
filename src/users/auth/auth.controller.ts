import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { NATS_SERVICE } from '@/src/config';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, LoginOtpDto, VerifyOtpDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.client.send({ cmd: 'login' }, loginDto);
  }

  @Post('/login-otp')
  loginOtp(@Body() loginOtpDto: LoginOtpDto) {
    return this.client.send({ cmd: 'loginOtp' }, loginOtpDto);
  }

    @Post('/verify-otp')
    verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
      return this.client.send({ cmd: 'verifyOtp' }, verifyOtpDto);
    }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
