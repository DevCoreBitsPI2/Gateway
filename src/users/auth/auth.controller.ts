import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { NATS_SERVICE } from '@/src/config';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, LoginOtpDto, VerifyOtpDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('/login')
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso. Retorna el token de acceso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.client.send({ cmd: 'login' }, loginDto);
  }

  @Post('/login-otp')
  @ApiOperation({ summary: 'Solicitar OTP por correo electrónico' })
  @ApiBody({ type: LoginOtpDto })
  @ApiResponse({ status: 200, description: 'OTP enviado al correo indicado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  loginOtp(@Body() loginOtpDto: LoginOtpDto) {
    return this.client.send({ cmd: 'loginOtp' }, loginOtpDto);
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verificar OTP y obtener token de acceso' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP válido. Retorna el token de acceso.' })
  @ApiResponse({ status: 401, description: 'OTP inválido o expirado.' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.client.send({ cmd: 'verifyOtp' }, verifyOtpDto);
  }
}
