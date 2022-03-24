import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { stringToFloat } from '../utils/currency';

@Injectable()
export class ProfileRequestDataMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    if (request.body.limit) {
      const {
        bet_max,
        bet_max_multiple,
        bet_max_event,
        bet_max_win,
        bet_max_multiple_win,
        bet_min,
        bet_min_multiple,
        quote_min_ticket,
      } = request.body.limit;

      request.body.bet_max = stringToFloat(bet_max);
      request.body.bet_max_multiple = stringToFloat(bet_max_multiple);
      request.body.bet_max_event = stringToFloat(bet_max_event);
      request.body.bet_max_win = stringToFloat(bet_max_win);
      request.body.bet_max_multiple_win = stringToFloat(bet_max_multiple_win);
      request.body.bet_min = stringToFloat(bet_min);
      request.body.bet_min_multiple = stringToFloat(bet_min_multiple);
      request.body.quote_min_ticket = stringToFloat(quote_min_ticket);
    }

    next();
  }
}
