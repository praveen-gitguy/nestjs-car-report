import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]): {};
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(ctx: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler
      .handle()
      .pipe(
        map((data: any) =>
          plainToClass(this.dto, data, { excludeExtraneousValues: true }),
        ),
      );
  }
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
