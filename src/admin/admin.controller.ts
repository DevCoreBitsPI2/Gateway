import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { NATS_SERVICE } from '@/src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAdminDto } from './dto';


@Controller('users')
export class AdminController {
    constructor(
      @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }


  @Post('/create-admin')
  createAdmin(@Body() createAdminDto: CreateAdminDto){
  
    return this.client.send({cmd : 'createAdmin'}, createAdminDto)
  
  }

  @Get('/users/findAll')
  findAll() {
    return this.client.send({cmd:'findAllUsers'}, {});
  }

  @Get('/users/:id')
  findOne(@Param('id') id: string) {
  return this.client.send({cmd: "findUserById"}, id);
  }

  @Get('/admin')
  findAllAdmins(){
    return this.client.send({cmd: "findAllAdmins"}, {});
  }

  @Get('/admin/:id')
  findAdminById(@Param('id') id: string){
    return this.client.send({cmd: "findAdminById"}, id);
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
