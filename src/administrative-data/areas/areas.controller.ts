import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PaginationDto } from '@/src/common';

@Controller('administrative-data/areas')
export class AreasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-area')
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.client.send({ cmd: 'createArea' }, createAreaDto)
    .pipe(
      catchError((err) => { 
        throw new RpcException(err);  
      }),
    );
  }

  @Get('find-all-areas')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({cmd: 'findAllAreas'}, paginationDto)
    .pipe(
      catchError((err) => { 
        throw new RpcException(err); 
      }),
    );
  }

  @Get('find-area/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({cmd:'findOneArea'}, id)
    .pipe(
      catchError((err) => { 
        throw new RpcException(err); 
      }),
    );
  }

  @Patch('update-area/:id')
  update(@Param('id', ParseIntPipe) id: number,@Body() updateAreaDto: UpdateAreaDto,) {
    return this.client.send({cmd:'updateArea'}, { ...updateAreaDto, id })
    .pipe(
      catchError((err) => { 
        throw new RpcException(err); 
      }),
    );
  }

  @Delete('delete-area/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({cmd:'removeArea'}, id)
    .pipe(
      catchError((err) => { 
        throw new RpcException(err); 
      }),
    );
  }
}
