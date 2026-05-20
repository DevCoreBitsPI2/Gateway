import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';
import { CreatePositionDto, PositionPaginationDto, UpdatePositionDto } from './dto';
import { AuthGuard, PositionGuard } from '@/src/guards';
import { Positions } from '@/src/decorators';
import { PositionId } from '@/src/guards/enum/position-id.enum';

@ApiTags('Positions')
@ApiBearerAuth()
@Controller('administrative-data/positions')
export class PositionsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @Post('create-position')
  @ApiOperation({ summary: 'Crear un nuevo cargo' })
  @ApiBody({ type: CreatePositionDto })
  @ApiResponse({ status: 201, description: 'Cargo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.client.send({ cmd: 'createPosition' }, createPositionDto)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('find-all-positions')
  @ApiOperation({ summary: 'Obtener todos los cargos (paginado)' })
  @ApiResponse({ status: 200, description: 'Lista de cargos.' })
  findAll(@Query() paginationDto: PositionPaginationDto) {
    return this.client.send({ cmd: 'findAllPositions' }, paginationDto)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('find-position/:id')
  @ApiOperation({ summary: 'Obtener un cargo por ID' })
  @ApiParam({ name: 'id', description: 'ID del cargo', example: 1 })
  @ApiResponse({ status: 200, description: 'Cargo encontrado.' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findOnePosition' }, id)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @Patch('update-position/:id')
  @ApiOperation({ summary: 'Actualizar un cargo por ID' })
  @ApiParam({ name: 'id', description: 'ID del cargo', example: 1 })
  @ApiBody({ type: UpdatePositionDto })
  @ApiResponse({ status: 200, description: 'Cargo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePositionDto: UpdatePositionDto) {
    return this.client.send({ cmd: 'updatePosition' }, { ...updatePositionDto, id })
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Delete('delete-position/:id')
  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @ApiOperation({ summary: 'Eliminar un cargo por ID' })
  @ApiParam({ name: 'id', description: 'ID del cargo', example: 1 })
  @ApiResponse({ status: 200, description: 'Cargo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removePosition' }, id)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @Get('positions-tree')
  @ApiOperation({ summary: 'Obtener el árbol jerárquico de cargos' })
  @ApiResponse({ status: 200, description: 'Árbol de cargos.' })
  getPositionsTree() {
    return this.client.send({ cmd: 'positionsTree' }, {})
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }

  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @Put('remove-father/:id')
  @ApiOperation({ summary: 'Eliminar la jerarquía padre de un cargo' })
  @ApiParam({ name: 'id', description: 'ID del cargo al que se le elimina el padre', example: 4 })
  @ApiResponse({ status: 200, description: 'Jerarquía eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado.' })
  removeHierarchy(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removePositionHierarchy' }, id)
      .pipe(catchError((err) => { throw new RpcException(err); }));
  }
}
