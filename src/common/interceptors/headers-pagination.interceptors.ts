import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { PagingResult } from 'typeorm-cursor-pagination';

@Injectable()
export class HeadersPaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(({ data, cursor }: PagingResult<any>) => {
        const res = context.switchToHttp().getResponse();
        res.setHeader('X-Cursor-Previous', cursor.beforeCursor);
        res.setHeader('X-Cursor-Next', cursor.afterCursor);
        return data;
      }),
    );
  }
}
