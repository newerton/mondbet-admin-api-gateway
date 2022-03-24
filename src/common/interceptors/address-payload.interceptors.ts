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
        res.setHeader('X-Prev-Cursor', cursor.beforeCursor);
        res.setHeader('X-Next-Cursor', cursor.afterCursor);
        return data;
      }),
    );
  }
}
