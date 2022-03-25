import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { stringToFloat } from '../utils/currency';

@Injectable()
export class AgentRequestDataMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { email, document, birthday, phone } = request.body;

    if (email) {
      request.body.email = email.toLowerCase();
    }

    if (document) {
      console.log({ document });
      request.body.document = document.replace(/[^\d]/g, '');
    } else {
      request.body.document = null;
    }

    if (birthday) {
      console.log({ birthday });
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
        request.body.address = null;
      }
    }

    if (request.body.limit) {
      const {
        general_limit,
        reward_percentage,
        daily_limit_single_bet,
        daily_limit_double_bet,
        daily_limit_triple_bet,
      } = request.body.limit;

      request.body.limit.general_limit = stringToFloat(general_limit);
      request.body.limit.reward_percentage = stringToFloat(reward_percentage);
      request.body.limit.daily_limit_single_bet = stringToFloat(
        daily_limit_single_bet,
      );
      request.body.limit.daily_limit_double_bet = stringToFloat(
        daily_limit_double_bet,
      );
      request.body.limit.daily_limit_triple_bet = stringToFloat(
        daily_limit_triple_bet,
      );
    }

    next();
  }
}
