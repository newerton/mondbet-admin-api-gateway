import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AgentRequestDataMiddleware implements NestMiddleware {
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

    next();
  }
}
