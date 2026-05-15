import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractPaginationDto, CreateContractDto, RenewContractDto, UpdateContractDto } from './dto';
import { AuthGuard, PositionGuard } from '@/src/guards';
import { Positions } from '@/src/decorators';
import { PositionId } from '@/src/guards/enum/position-id.enum';

@ApiTags('Contracts')
@ApiBearerAuth()
@Controller('administrative-data/contracts')
export class ContractsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @Post('create-contract')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Crear un nuevo contrato (requiere archivo PDF)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del contrato junto con el archivo PDF',
    schema: {
      type: 'object',
      required: ['file', 'conditions', 'contractType', 'startDate', 'endDate', 'idEmployee', 'idManager'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Archivo del contrato (PDF)' },
        conditions: { type: 'string', example: 'Contrato a término fijo por 1 año' },
        contractType: { type: 'string', example: 'fixed_term_contract' },
        contractStatus: { type: 'string', example: 'valid' },
        startDate: { type: 'string', format: 'date', example: '2025-01-01' },
        endDate: { type: 'string', format: 'date', example: '2026-01-01' },
        idEmployee: { type: 'number', example: 10 },
        idManager: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Contrato creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Archivo requerido o datos inválidos.' })
  @ApiResponse({ status: 403, description: 'Sin permisos para crear contratos.' })
  async createContract(@UploadedFile() file: Express.Multer.File, @Body() createContractDto: CreateContractDto) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const payload = {
      ...createContractDto,
      bufferBase64: file.buffer.toString('base64'),
      mimetype: file.mimetype,
      originalname: file.originalname,
      fieldname: file.fieldname,
      encoding: file.encoding,
    };

    return firstValueFrom(
      this.client.send({ cmd: 'createContract' }, payload).pipe(
        catchError((err) => { throw new RpcException(err); }),
      ),
    );
  }

  @Get('find-all-contracts')
  @ApiOperation({ summary: 'Obtener todos los contratos (paginado)' })
  @ApiResponse({ status: 200, description: 'Lista de contratos.' })
  findAll(@Query() paginationDto: ContractPaginationDto) {
    return this.client.send({ cmd: 'findAllContracts' }, paginationDto).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('find-contract/:id')
  @ApiOperation({ summary: 'Obtener un contrato por ID' })
  @ApiParam({ name: 'id', description: 'ID del contrato', example: 1 })
  @ApiResponse({ status: 200, description: 'Contrato encontrado.' })
  @ApiResponse({ status: 404, description: 'Contrato no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findOneContract' }, id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de contratos' })
  @ApiResponse({ status: 200, description: 'Estadísticas de contratos.' })
  getStats() {
    return this.client.send({ cmd: 'getContractStats' }, {}).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch('update-contract/:id')
  @ApiOperation({ summary: 'Actualizar un contrato por ID' })
  @ApiParam({ name: 'id', description: 'ID del contrato', example: 1 })
  @ApiBody({ type: UpdateContractDto })
  @ApiResponse({ status: 200, description: 'Contrato actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Contrato no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateContractDto: UpdateContractDto) {
    return this.client.send({ cmd: 'updateContract' }, { ...updateContractDto, id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Delete('delete-contract/:id')
  @ApiOperation({ summary: 'Eliminar un contrato por ID' })
  @ApiParam({ name: 'id', description: 'ID del contrato', example: 1 })
  @ApiResponse({ status: 200, description: 'Contrato eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Contrato no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'removeContract' }, id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch('renew-contract/:id')
  @ApiOperation({ summary: 'Renovar un contrato por ID' })
  @ApiParam({ name: 'id', description: 'ID del contrato a renovar', example: 1 })
  @ApiBody({ type: RenewContractDto })
  @ApiResponse({ status: 200, description: 'Contrato renovado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Contrato no encontrado.' })
  renew(@Param('id', ParseIntPipe) id: number, @Body() renewContractDto: RenewContractDto) {
    return this.client.send({ cmd: 'renewContract' }, { id, ...renewContractDto }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get('find-contracts-by-employee/:id')
  @ApiOperation({ summary: 'Obtener todos los contratos de un empleado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de contratos del empleado.' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  findByEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findContractsByEmployee' }, id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }
}
