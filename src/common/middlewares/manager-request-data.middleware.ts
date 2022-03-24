import { Injectable, NestMiddleware } from '@nestjs/common';
import currency from 'currency.js';
import { Request, Response, NextFunction } from 'express';
import { stringToFloat } from '../utils/currency';

@Injectable()
export class ManagerRequestDataMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { email, document, birthday, phone } = request.body;

    request.body.email = email.toLowerCase();

    if (document) {
      request.body.document = document.replace(/[^\d]/g, '');
    } else {
      request.body.document = null;
    }

    if (birthday) {
      request.body.birthday = birthday.split('/').reverse().join('-');
    } else {
      request.body.birthday = null;
    }

    if (!phone) {
      request.body.phone = null;
    }

    if (request.body.address) {
      const { zipcode, street, neighborhood, state_id, city_id } =
        request.body.address;

      const addressIsValid =
        !!zipcode && !!street && !!neighborhood && !!state_id && !!city_id;

      if (!addressIsValid) {
        delete request.body.address;
      }
    }

    if (request.body.limit) {
      const {
        general_limit,
        daily_limit_single_bet,
        weekly_limit_single_bet,
        daily_limit_double_bet,
        daily_limit_triple_bet,
      } = request.body.limit;

      console.log({
        general_limit,
        daily_limit_single_bet,
        weekly_limit_single_bet,
        daily_limit_double_bet,
        daily_limit_triple_bet,
      });

      request.body.limit.general_limit = stringToFloat(general_limit);
      request.body.limit.daily_limit_single_bet = stringToFloat(
        daily_limit_single_bet,
      );
      request.body.limit.weekly_limit_single_bet = stringToFloat(
        weekly_limit_single_bet,
      );
      request.body.limit.daily_limit_double_bet = stringToFloat(
        daily_limit_double_bet,
      );
      request.body.limit.daily_limit_triple_bet = stringToFloat(
        daily_limit_triple_bet,
      );
    }

    console.log(request.body);
    next();
  }
}
