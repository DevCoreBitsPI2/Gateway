import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';
import { PaginationDto } from '@/src/common';
import { CreatePerformanceEvaluationDto } from './dto/create-performance-evaluation.dto';
import { UpdatePerformanceEvaluationDto } from './dto/update-performance-evaluation.dto';
import { GenerateConsolidatedPerformanceReportDto } from './dto/generate-consolidated-performance-report.dto';
import { GenerateAreaPerformanceReportDto } from './dto/generate-area-performance-report.dto';


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

  @Post('generate-performance-evaluation-report')
  @ApiOperation({ summary: 'Generar reporte consolidado de desempeño' })
  @ApiBody({ type: GenerateConsolidatedPerformanceReportDto })
  @ApiResponse({ status: 201, description: 'Reporte consolidado generado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o sin información en el rango seleccionado.' })
  async generateConsolidatedReport(
    @Body() payload: GenerateConsolidatedPerformanceReportDto,
    @Res() res: any,
  ) {
    try {
      const result = await firstValueFrom(this.client.send({ cmd: 'generateConsolidatedReport' }, payload));
      if (result && result.csv) {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="performance-report.csv"');
        return res.send(result.csv);
      }
      return res.json(result);
    } catch (err:any) {
      throw new RpcException(err);
    }
  }

  @Post('generate-performance-evaluation-report-by-area')
  @ApiOperation({ summary: 'Generar reporte consolidado de desempeño por área' })
  @ApiBody({ type: GenerateAreaPerformanceReportDto })
  @ApiResponse({ status: 201, description: 'Reporte por área generado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o área sin información.' })
  async generateAreaReport(
    @Body() payload: GenerateAreaPerformanceReportDto,
    @Res() res: any,
  ) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'generateAreaConsolidatedReport' }, payload)
      );
      if (result && result.csv) {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="area-${payload.areaId}-performance-report.csv"`);
        return res.send(result.csv);
      }
      return res.json(result);
    } catch (err: any) {
      throw new RpcException(err);
    }
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
