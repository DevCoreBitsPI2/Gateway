import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';
import { PaginationDto } from '@/src/common';
import { CreatePerformanceEvaluationDto } from './dto/create-performance-evaluation.dto';
import { UpdatePerformanceEvaluationDto } from './dto/update-performance-evaluation.dto';

@ApiTags('Performance Evaluation')
@ApiBearerAuth()
@Controller()
export class PerformanceEvaluationController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-performance-evaluation')
  @ApiOperation({ summary: 'Crear una nueva evaluación de desempeño' })
  @ApiBody({ type: CreatePerformanceEvaluationDto })
  @ApiResponse({ status: 201, description: 'Evaluación creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createPerformanceEvaluationDto: CreatePerformanceEvaluationDto) {
    return this.client.send({ cmd: 'createPerformanceEvaluation' }, createPerformanceEvaluationDto)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('find-all-performance-evaluation')
  @ApiOperation({ summary: 'Obtener todas las evaluaciones de desempeño (paginado)' })
  @ApiResponse({ status: 200, description: 'Lista de evaluaciones.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAllPerformanceEvaluation' }, paginationDto)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('find-performance-evaluation/:id')
  @ApiOperation({ summary: 'Obtener una evaluación de desempeño por ID' })
  @ApiParam({ name: 'id', description: 'ID de la evaluación', example: 1 })
  @ApiResponse({ status: 200, description: 'Evaluación encontrada.' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findOnePerformanceEvaluation' }, id)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Patch('update-performance-evaluation/:id')
  @ApiOperation({ summary: 'Actualizar una evaluación de desempeño por ID' })
  @ApiParam({ name: 'id', description: 'ID de la evaluación', example: 1 })
  @ApiBody({ type: UpdatePerformanceEvaluationDto })
  @ApiResponse({ status: 200, description: 'Evaluación actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerformanceEvaluationDto: UpdatePerformanceEvaluationDto,
  ) {
    return this.client.send({ cmd: 'updatePerformanceEvaluation' }, { ...updatePerformanceEvaluationDto, id })
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Delete('delete-performance-evaluation/:id')
  @ApiOperation({ summary: 'Eliminar una evaluación de desempeño por ID' })
  @ApiParam({ name: 'id', description: 'ID de la evaluación', example: 1 })
  @ApiResponse({ status: 200, description: 'Evaluación eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removePerformanceEvaluation' }, id)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }
}
