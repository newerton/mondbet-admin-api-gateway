import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProfileLimitTypeRole } from 'src/app/profile/entities/profile-limit.entity';
import { stringToFloat } from '../utils/currency';

@Injectable()
export class ProfileRequestDataMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    delete request.body.sport;

    if (request.body.combined) {
      request.body.combined = stringToFloat(request.body.combined);
    }

    if (request.body.limit && request.body.limit.length === 2) {
      request.body.limit.map((value, key) => {
        if (key < 2) {
          const {
            bet_max,
            bet_max_multiple,
            bet_max_event,
            bet_max_win,
            bet_max_multiple_win,
            bet_min,
            bet_min_multiple,
            quote_min_ticket,
          } = value;

          request.body.limit[key].type =
            key === 0
              ? ProfileLimitTypeRole.PREMATCH
              : ProfileLimitTypeRole.LIVE;
          request.body.limit[key].bet_max = stringToFloat(bet_max);
          request.body.limit[key].bet_max_multiple =
            stringToFloat(bet_max_multiple);
          request.body.limit[key].bet_max_event = stringToFloat(bet_max_event);
          request.body.limit[key].bet_max_win = stringToFloat(bet_max_win);
          request.body.limit[key].bet_max_multiple_win =
            stringToFloat(bet_max_multiple_win);
          request.body.limit[key].bet_min = stringToFloat(bet_min);
          request.body.limit[key].bet_min_multiple =
            stringToFloat(bet_min_multiple);
          request.body.limit[key].quote_min_ticket =
            stringToFloat(quote_min_ticket);
        }
      });
    }

    next();
  }
}
