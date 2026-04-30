import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators";

  @Injectable()                                                                                                                                                                               
  export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}                                                                                                                                              
                                                            
    canActivate(context: ExecutionContext): boolean {
      const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),                                                     
        context.getClass(),                                                                                                                                                                   
      ]);                  
                                                                                                                                                                                              
      if (!allowedRoles?.length) return true;               
                                             
      const { role } = context.switchToHttp().getRequest();
      if (!allowedRoles.includes(role)) {                                                                                                                                                     
        throw new ForbiddenException('Insufficient role');
      }                                                                                                                                                                                       
      return true;                                          
    }             
  }
