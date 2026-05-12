import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';
import { AreaPaginationDto, CreateAreaDto, UpdateAreaDto } from './dto';

@ApiTags('Areas')
@ApiBearerAuth()
@Controller('administrative-data/areas')
export class AreasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-area')
  @ApiOperation({ summary: 'Crear un nueva área' })
  @ApiBody({ type: CreateAreaDto })
  @ApiResponse({ status: 201, description: 'Área creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.client.send({ cmd: 'createArea' }, createAreaDto)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('find-all-areas')
  @ApiOperation({ summary: 'Obtener todas las áreas (paginado)' })
  @ApiResponse({ status: 200, description: 'Lista de áreas.' })
  findAll(@Query() paginationDto: AreaPaginationDto) {
    return this.client.send({ cmd: 'findAllAreas' }, paginationDto)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('find-area/:id')
  @ApiOperation({ summary: 'Obtener un área por ID' })
  @ApiParam({ name: 'id', description: 'ID del área', example: 1 })
  @ApiResponse({ status: 200, description: 'Área encontrada.' })
  @ApiResponse({ status: 404, description: 'Área no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findOneArea' }, id)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Patch('update-area/:id')
  @ApiOperation({ summary: 'Actualizar un área por ID' })
  @ApiParam({ name: 'id', description: 'ID del área', example: 1 })
  @ApiBody({ type: UpdateAreaDto })
  @ApiResponse({ status: 200, description: 'Área actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Área no encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateAreaDto) {
    return this.client.send({ cmd: 'updateArea' }, { ...updateAreaDto, id })
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Delete('delete-area/:id')
  @ApiOperation({ summary: 'Eliminar un área por ID' })
  @ApiParam({ name: 'id', description: 'ID del área', example: 1 })
  @ApiResponse({ status: 200, description: 'Área eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Área no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removeArea' }, id)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }
}
