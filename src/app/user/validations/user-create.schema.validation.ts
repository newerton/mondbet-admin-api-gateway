import * as JoiBase from 'joi';
import { CreateSchema } from 'src/common/schemas/joi/joi.create.schema.factory';
import joiMessagesSchema from 'src/common/schemas/joi/joi.messages.schema';

const Joi = JoiBase;

export class UserCreateSchema implements CreateSchema {
  createSchema(): JoiBase.ObjectSchema {
    return Joi.object({
      first_name: Joi.string()
        .required()
        .label('Nome')
        .messages(joiMessagesSchema),
      last_name: Joi.string()
        .required()
        .label('Sobrenome')
        .messages(joiMessagesSchema),
      email: Joi.string()
        .email()
        .lowercase()
        .required()
        .label('E-mail')
        .messages(joiMessagesSchema),
      password: Joi.string()
        .required()
        .label('Senha')
        .messages(joiMessagesSchema),
      repeat_password: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .label('Repita a senha')
        .messages(joiMessagesSchema),
      visible: Joi.boolean()
        .required()
        .label('Liberar o acesso')
        .messages(joiMessagesSchema),
    });
  }
}
