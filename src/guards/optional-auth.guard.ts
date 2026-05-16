import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@/src/config';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) return true;

    try {
      const { position, isAdmin, token: newToken, supabaseUserId, employeeId } = await firstValueFrom(
        this.client.send({ cmd: 'verifyToken' }, token),
      );

      request['position'] = position;
      request['isAdmin'] = isAdmin;
      request['token'] = newToken;
      request['supabaseUserId'] = supabaseUserId;
      request['employeeId'] = employeeId;
      request['authUser'] = {
        position,
        isAdmin,
        token: newToken,
        supabaseUserId,
        employeeId,
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
