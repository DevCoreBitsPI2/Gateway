import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('administrative-data/positions')
export class PositionsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.client.send('createPosition', createPositionDto).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get()
  findAll() {
    return this.client.send('findAllPositions', {}).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('findOnePosition', id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.client.send('updatePosition', { ...updatePositionDto, id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('removePosition', id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }
}
