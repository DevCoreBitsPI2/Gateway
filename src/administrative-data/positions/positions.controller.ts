import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query, Put } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { CreatePositionDto, UpdatePositionDto } from './dto';

@Controller('administrative-data/positions')
export class PositionsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-position')
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.client.send({ cmd: 'createPosition' }, createPositionDto)
    .pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('find-all-positions')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAllPositions' }, paginationDto)
    .pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('find-position/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findOnePosition' }, id)
    .pipe(
      catchError((err) => { 
        throw new RpcException(err); 
      }),
    );
  }

  @Patch('update-position/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePositionDto: UpdatePositionDto,) {
    return this.client.send({ cmd: 'updatePosition' }, { ...updatePositionDto, id }).pipe(
      catchError((err) => { 
        throw new RpcException(err); 
      }),
    );
  }

  @Delete('delete-position/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removePosition' }, id)
    .pipe(
      catchError((err) => { 
        throw new RpcException(err); 
      }),
    );
  }

  @Get('positions-tree')
  getPositionsTree(){
    return this.client.send({ cmd: 'positionsTree' },{})
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    )
  }

  @Put('remove-father/:id')
  removeHierarchy(@Param('id', ParseIntPipe) id: number){
    return this.client.send({ cmd: 'removePositionHierarchy' }, id)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    )
  }
}
