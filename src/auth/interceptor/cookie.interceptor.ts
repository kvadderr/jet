import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  /** Set refreshToken to cookie and remove refreshToken from payload */
  @Injectable()
  export class CookieInterceptor implements NestInterceptor {
    
  }