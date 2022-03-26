import * as JoiBase from 'joi';
import { CreateSchema } from 'src/common/schemas/joi/joi.create.schema.factory';
import joiMessagesSchema from 'src/common/schemas/joi/joi.messages.schema';

const Joi = JoiBase;

export class UpdateProfileSchema implements CreateSchema {
  createSchema(): JoiBase.ObjectSchema {
    return Joi.object({
      title: Joi.string().label('Título').messages(joiMessagesSchema),
      sport_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .label('Esporte')
        .messages(joiMessagesSchema),
      combined: Joi.number()
        .integer()
        .min(0)
        .label('Combinada')
        .messages({
          ...joiMessagesSchema,
          ...{
            'number.min': 'O valor mínimo não pode ser menor que 0',
          },
        }),
      visible: Joi.boolean()
        .label('Liberar o acesso')
        .messages(joiMessagesSchema),
      limit: Joi.array().items(
        Joi.object({
          id: Joi.string()
            .guid({ version: 'uuidv4' })
            .label('Limit ID')
            .messages(joiMessagesSchema),
          type: Joi.string().required().label('Tipo').valid('prematch', 'live'),
          bet_max: Joi.number()
            .min(0)
            .required()
            .label('Aposta máxima')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
          bet_max_multiple: Joi.number()
            .min(0)
            .required()
            .label('Casadinha máxima')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
          bet_max_event: Joi.number()
            .min(0)
            .required()
            .label('Máxima por evento')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
          bet_max_win: Joi.number()
            .min(0)
            .required()
            .label('Máximo ganho por aposta')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
          bet_max_multiple_win: Joi.number()
            .min(0)
            .required()
            .label('Máximo ganho por aposta casadinha')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
          bet_min: Joi.number()
            .min(0)
            .required()
            .label('Cotação minima de uma aposta')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
          bet_min_multiple: Joi.number()
            .min(0)
            .required()
            .label('Cotação minima de uma aposta casadinha')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
          quote_min_ticket: Joi.number()
            .min(0)
            .required()
            .label('Cotação minima do bilhete')
            .messages({
              ...joiMessagesSchema,
              ...{
                'number.min': 'O valor mínimo não pode ser menor que 0',
              },
            }),
        }),
      ),
    });
  }
}
