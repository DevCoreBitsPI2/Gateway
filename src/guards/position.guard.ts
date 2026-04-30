import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';                                                                                             
import { Reflector } from '@nestjs/core';                                                                                                                                                   
import { POSITIONS_KEY } from '../decorators';

                                                                                                                                                                                              
  @Injectable()                                             
  export class PositionGuard implements CanActivate {                                                                                                                                         
    constructor(private reflector: Reflector) {}            

    canActivate(context: ExecutionContext): boolean {
      const allowedPositions = this.reflector.getAllAndOverride<number[]>(POSITIONS_KEY, [
        context.getHandler(),                                                                                                                                                                 
        context.getClass(),
      ]);                                                                                                                                                                                     
                                                            
      if (!allowedPositions?.length) return true;                                                                                                                                             
   
      const request = context.switchToHttp().getRequest();                                                                                                                                    
      if (!allowedPositions.includes(request.position)) {   
        throw new ForbiddenException('Insufficient position');
      }                                                                                                                                                                                       
      return true;
    }                                                                                                                                                                                         
  }     