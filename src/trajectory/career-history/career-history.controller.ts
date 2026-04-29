import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCareerHistoryDto } from './dto/create-career-history.dto';
import { UpdateCareerHistoryDto } from './dto/update-career-history.dto';
import { PaginationDto } from '@/src/common';

@Controller()
export class CareerHistoryController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-career-history')
  create(@Body() CreateCareerHistoryDto: CreateCareerHistoryDto) {
    return this.client.send({ cmd: 'createCareerHistory' }, CreateCareerHistoryDto)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('find-all-career-history')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({cmd: 'findAllCareerHistory'}, paginationDto)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('find-career-history/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({cmd: 'findOneCareerHistory'}, id)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch('update-career-history/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateCareerHistoryDto: UpdateCareerHistoryDto,
  ) {
    return this.client.send({cmd: 'updateCareerHistory'}, {...UpdateCareerHistoryDto, id})
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('delete-career-history/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({cmd: 'removeCareerHistory'}, id)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}


