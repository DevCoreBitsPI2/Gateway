import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NATS_SERVICE } from '@/src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAdminDto } from './dto';
import { AuthGuard, RoleGuard } from '@/src/guards';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('admin')
export class AdminController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('/create-admin')
  @ApiOperation({ summary: 'Crear un nuevo administrador' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Administrador creado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.client.send({ cmd: 'createAdmin' }, createAdminDto);
  }

  @Get('/admin')
  @ApiOperation({ summary: 'Obtener todos los administradores' })
  @ApiResponse({ status: 200, description: 'Lista de administradores.' })
  findAllAdmins() {
    return this.client.send({ cmd: 'findAllAdmins' }, {});
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un administrador por ID' })
  @ApiParam({ name: 'id', description: 'ID del administrador', example: 1 })
  @ApiResponse({ status: 200, description: 'Administrador encontrado.' })
  @ApiResponse({ status: 404, description: 'Administrador no encontrado.' })
  findAdminById(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'findAdminById' }, id);
  }

  @Get('/blockUser/:id')
  @ApiOperation({ summary: 'Bloquear un usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a bloquear',
    example: 5,
  })
  @ApiResponse({ status: 200, description: 'Usuario bloqueado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  blockUser(@Param('id') id: number) {
    return this.client.send({ cmd: 'blockUser' }, id);
  }

  @Get('/unblockUser/:id')
  @ApiOperation({ summary: 'Desbloquear un usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a desbloquear',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario desbloqueado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  unblockUser(@Param('id') id: number) {
    return this.client.send({ cmd: 'unblockUser' }, id);
  }

  @Get('/suspendEmployee/:id')
  @ApiOperation({ summary: 'Suspender un empleado por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del empleado a suspender',
    example: 7,
  })
  @ApiResponse({
    status: 200,
    description: 'Empleado suspendido exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  suspendEmployee(@Param('id') id: number) {
    return this.client.send({ cmd: 'suspendEmployee' }, id);
  }

  @Get('/resendInvitation/:id')
  @ApiOperation({ summary: 'Reenviar invitación a un empleado por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del empleado al que se reenvía la invitación',
    example: 7,
  })
  @ApiResponse({
    status: 200,
    description: 'Invitación reenviada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  resendInvitation(@Param('id') id: number) {
    return this.client.send({ cmd: 'resendInvitation' }, id);
  }
}
