
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
const multer = require('multer');
import { multerConfig } from '../../../common/utils/multer-config';

@Injectable()
export class AssetMultipartInterceptor implements NestInterceptor {
  private upload = multer({
    ...multerConfig,
    limits: {
      fieldSize: 100 * 1024 * 1024,
      fileSize: 100 * 1024 * 1024,
    },
  }).any();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return new Observable((subscriber) => {
      this.upload(req, res, (err: any) => {
        if (err) {
          console.error('Custom Multer Error:', err);
          subscriber.error(err);
        } else {
          subscriber.next(true);
          subscriber.complete();
        }
      });
    }).pipe(switchMap(() => next.handle()));
  }
}
