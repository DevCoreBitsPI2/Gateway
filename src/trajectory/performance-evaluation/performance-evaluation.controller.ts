import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePerformanceEvaluationDto } from './dto/create-performance-evaluation.dto';
import { UpdatePerformanceEvaluationDto } from './dto/update-performance-evaluation.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '@/src/config';
import { PaginationDto } from '@/src/common';
import { catchError } from 'rxjs';

@Controller()
export class PerformanceEvaluationController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-performance-evaluation')
  create(@Payload() createPerformanceEvaluationDto: CreatePerformanceEvaluationDto) {
    return this.client.send({ cmd: 'createPerformanceEvaluation' }, createPerformanceEvaluationDto)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    )
  }

  @Get('find-all-performance-evaluation')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd:'findAllPerformanceEvaluation' }, paginationDto)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('find-performance-evaluation/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findOnePerformanceEvaluation' }, id)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch('update-performance-evaluation/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerformanceEvaluationDto: UpdatePerformanceEvaluationDto,
  ) {
    return this.client.send({ cmd: 'updatePerformanceEvaluation' }, { ...updatePerformanceEvaluationDto, id })
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('delete-performance-evaluation/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removePerformanceEvaluation' }, id)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
