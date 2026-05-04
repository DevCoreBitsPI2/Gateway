import { Controller, Get, Post, Body, Patch, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NATS_SERVICE } from '@/src/config';
import { ClientProxy } from '@nestjs/microservices';
import { InviteUserDto, UpdateProfileDto, UpdateEmployeeDto } from './dto';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('/inviteUser')
  @ApiOperation({ summary: 'Invitar a un nuevo empleado' })
  @ApiBody({ type: InviteUserDto })
  @ApiResponse({ status: 201, description: 'Invitación enviada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  inviteUser(@Body() inviteUserDto: InviteUserDto) {
    return this.client.send({ cmd: 'inviteUser' }, inviteUserDto);
  }

  @Get('/findAll')
  @ApiOperation({ summary: 'Obtener todos los empleados' })
  @ApiResponse({ status: 200, description: 'Lista de empleados.' })
  findAll() {
    return this.client.send({ cmd: 'findAllUsers' }, {});
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado.' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'findUserById' }, id);
  }

  @Get('/getMyProfile/:id')
  @ApiOperation({ summary: 'Obtener el perfil propio de un empleado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 200, description: 'Perfil del empleado.' })
  getMyProfile(@Param('id') id: string) {
    return this.client.send({ cmd: 'getMyProfile' }, id);
  }

  @Get('/getSubordinates/:id')
  @ApiOperation({ summary: 'Obtener los subordinados de un gerente' })
  @ApiParam({ name: 'id', description: 'ID del gerente', example: '5' })
  @ApiResponse({ status: 200, description: 'Lista de subordinados del gerente.' })
  getSubordinates(@Param('id') id: string) {
    return this.client.send({ cmd: 'getSubordinates' }, id);
  }

  @Patch('/updateUser/:id')
  @ApiOperation({ summary: 'Actualizar el perfil propio de un empleado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  updateUser(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.client.send({ cmd: 'updateUser' }, { id, ...updateProfileDto });
  }

  @Patch('/updateEmployee/:id')
  @ApiOperation({ summary: 'Actualizar cargo, jefe o estado de un empleado (uso administrativo)' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ status: 200, description: 'Empleado actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.client.send({ cmd: 'updateEmployee' }, { id, ...updateEmployeeDto });
  }

  @Get('/firstTimeSetup/:id')
  @ApiOperation({ summary: 'Verificar si el empleado necesita configuración inicial' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 200, description: 'Estado de configuración inicial.' })
  firstTimeSetup(@Param('id') id: string) {
    return this.client.send({ cmd: 'firstTimeSetup' }, id);
  }

  @Patch('/completeFirstLogin/:id')
  @ApiOperation({ summary: 'Marcar el primer login como completado' })
  @ApiParam({ name: 'id', description: 'ID del empleado', example: '10' })
  @ApiResponse({ status: 200, description: 'Primer login marcado como completado.' })
  completeFirstLogin(@Param('id') id: string) {
    return this.client.send({ cmd: 'completeFirstLogin' }, id);
  }
}
