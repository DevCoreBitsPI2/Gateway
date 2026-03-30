import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('administrative-data')
export class AdministrativeDataController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  // @Post()
  // create(@Body() createAdministrativeDatumDto: any) {
  //   return this.administrativeDataService.create(createAdministrativeDatumDto);
  // }

  @Get('/findAll')
  findAll() {
    return this.client.send({cmd:'findAllAdministrativeData'}, {});
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.administrativeDataService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdministrativeDatumDto: UpdateAdministrativeDatumDto) {
  //   return this.administrativeDataService.update(+id, updateAdministrativeDatumDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.administrativeDataService.remove(+id);
  // }
}
