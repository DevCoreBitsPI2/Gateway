import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  UseGuards,
  ForbiddenException,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { NATS_SERVICE } from '@/src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import {
  InviteUserDto,
  ScanEmployeeQrDto,
  UpdateProfileDto,
  UpdateEmployeeDto,
} from './dto';
import { AuthGuard, OptionalAuthGuard, PositionGuard } from '@/src/guards';
import { AuthUser, Positions } from '@/src/decorators';
import { PositionId } from '@/src/guards/enum/position-id.enum';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('/inviteUser')
  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @ApiOperation({ summary: 'Invitar a un nuevo empleado' })
  @ApiBody({ type: InviteUserDto })
  @ApiResponse({ status: 201, description: 'Invitación enviada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  inviteUser(@Body() inviteUserDto: InviteUserDto) {
    return this.client.send({ cmd: 'inviteUser' }, inviteUserDto);
  }

  @Get('/findAll')
  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @ApiOperation({ summary: 'Obtener todos los empleados' })
  @ApiResponse({ status: 200, description: 'Lista de empleados.' })
  findAll() {
    return this.client.send({ cmd: 'findAllUsers' }, {});
  }

  @Post('/:id/qr')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Generar código QR temporal de un empleado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 201, description: 'QR temporal generado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para generar este QR.',
  })
  generateEmployeeQr(
    @Param('id') id: string,
    @AuthUser('employeeId') employeeId: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    return this.client.send(
      { cmd: 'generateEmployeeQr' },
      {
        id_employee: Number(id),
        scannerEmployeeId: employeeId,
        scannerIsAdmin: isAdmin === true,
      },
    );
  }

  @Post('/qr/scan')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Escanear QR temporal de un empleado' })
  @ApiBody({ type: ScanEmployeeQrDto })
  @ApiResponse({
    status: 200,
    description: 'Datos visibles del empleado según permisos.',
  })
  @ApiResponse({ status: 401, description: 'No autenticado o QR expirado.' })
  scanEmployeeQr(
    @Body() scanEmployeeQrDto: ScanEmployeeQrDto,
    @AuthUser('employeeId') employeeId: number,
    @AuthUser('position') position: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    return this.client.send(
      { cmd: 'scanEmployeeQr' },
      {
        qrToken: scanEmployeeQrDto.qrToken,
        scannerEmployeeId: employeeId,
        scannerPosition: position,
        scannerIsAdmin: isAdmin === true,
      },
    );
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado.' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  async findOne(
    @Param('id') id: string,
    @AuthUser('employeeId') employeeId: number,
    @AuthUser('position') position: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    await this.ensureEmployeeAccess(Number(id), employeeId, position, isAdmin);
    return this.client.send({ cmd: 'findUserById' }, Number(id));
  }

  @Get('/getMyProfile/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener el perfil propio de un empleado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 200, description: 'Perfil del empleado.' })
  getMyProfile(
    @Param('id') id: string,
    @AuthUser('supabaseUserId') supabaseUserId: string,
    @AuthUser('position') position: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    if (!isAdmin && !this.isHumanTalent(position) && id !== supabaseUserId) {
      throw new ForbiddenException('Insufficient employee access');
    }
    return this.client.send({ cmd: 'getMyProfile' }, id);
  }

  @Get('/getSubordinates/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener los subordinados de un gerente' })
  @ApiParam({ name: 'id', description: 'ID del gerente', example: '5' })
  @ApiResponse({
    status: 200,
    description: 'Lista de subordinados del gerente.',
  })
  getSubordinates(
    @Param('id') id: string,
    @AuthUser('employeeId') employeeId: number,
    @AuthUser('position') position: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    if (
      !isAdmin &&
      !this.isHumanTalent(position) &&
      Number(id) !== employeeId
    ) {
      throw new ForbiddenException('Insufficient employee access');
    }
    return this.client.send({ cmd: 'getSubordinates' }, Number(id));
  }

  @Patch('/updateUser/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar el perfil propio de un empleado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  updateUser(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @AuthUser('employeeId') employeeId: number,
    @AuthUser('position') position: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    if (
      !isAdmin &&
      !this.isHumanTalent(position) &&
      Number(id) !== employeeId
    ) {
      throw new ForbiddenException('Insufficient employee access');
    }
    return this.client.send(
      { cmd: 'updateProfile' },
      { ...updateProfileDto, id_employee: Number(id) },
    );
  }

  @Patch('/updateEmployee/:id')
  @UseGuards(AuthGuard, PositionGuard)
  @Positions(PositionId.HumanTalentAssistant, PositionId.HumanTalentLead)
  @ApiOperation({
    summary:
      'Actualizar cargo, jefe o estado de un empleado (uso administrativo)',
  })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({
    status: 200,
    description: 'Empleado actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.client.send(
      { cmd: 'updateEmployee' },
      { ...updateEmployeeDto, id_employee: id },
    );
  }

  @Get('/firstTimeSetup/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Verificar si el empleado necesita configuración inicial',
  })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 200, description: 'Estado de configuración inicial.' })
  firstTimeSetup(
    @Param('id') id: string,
    @AuthUser('supabaseUserId') supabaseUserId: string,
    @AuthUser('position') position: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    if (!isAdmin && !this.isHumanTalent(position) && id !== supabaseUserId) {
      throw new ForbiddenException('Insufficient employee access');
    }
    return this.client.send({ cmd: 'firstTimeSetup' }, id);
  }

  @Patch('/completeFirstLogin/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Marcar el primer login como completado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({
    status: 200,
    description: 'Primer login marcado como completado.',
  })
  completeFirstLogin(
    @Param('id') id: string,
    @AuthUser('supabaseUserId') supabaseUserId: string,
    @AuthUser('position') position: number,
    @AuthUser('isAdmin') isAdmin: boolean,
  ) {
    if (!isAdmin && !this.isHumanTalent(position) && id !== supabaseUserId) {
      throw new ForbiddenException('Insufficient employee access');
    }
    return this.client.send({ cmd: 'completeFirstLogin' }, id);
  }

  @Patch('/upload-profile-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir imagen de perfil del usuario autenticado' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Imagen de perfil',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Imagen de perfil',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen de perfil actualizada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Archivo inválido o faltante.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser('employeeId') employeeId: number,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const payload = {
      idUser: employeeId,
      bufferBase64: file.buffer.toString('base64'),
      mimetype: file.mimetype,
      originalname: file.originalname,
      fieldname: file.fieldname,
      encoding: file.encoding,
    };

    return firstValueFrom(
      this.client.send({ cmd: 'uploadProfileImage' }, payload).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
  }

  private async ensureEmployeeAccess(
    targetEmployeeId: number,
    requesterEmployeeId: number,
    requesterPosition: number,
    requesterIsAdmin: boolean,
  ) {
    if (
      requesterIsAdmin ||
      this.isHumanTalent(requesterPosition) ||
      targetEmployeeId === requesterEmployeeId
    ) {
      return;
    }

    const employee = await firstValueFrom(
      this.client.send({ cmd: 'findUserById' }, targetEmployeeId),
    );

    if (employee.id_manager !== requesterEmployeeId) {
      throw new ForbiddenException('Insufficient employee access');
    }
  }

  private isHumanTalent(position: number): boolean {
    return [
      PositionId.HumanTalentAssistant,
      PositionId.HumanTalentLead,
    ].includes(position);
  }
}
