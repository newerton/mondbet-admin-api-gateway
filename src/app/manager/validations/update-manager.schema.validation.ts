import * as JoiBase from 'joi';
import { CreateSchema } from 'src/common/schemas/joi/joi.create.schema.factory';
import joiMessagesSchema from 'src/common/schemas/joi/joi.messages.schema';
import dateValidator from 'joi-date-dayjs';
import documentValidator from 'cpf-cnpj-validator';
import phoneValidator from 'joi-phone-number';
import postalcodeValidator from 'joi-postalcode';

const Joi = JoiBase.extend(dateValidator)
  .extend(documentValidator)
  .extend(phoneValidator)
  .extend(postalcodeValidator);

export class UpdateManagerSchema implements CreateSchema {
  createSchema(): JoiBase.ObjectSchema {
    return Joi.object({
      profile_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .label('Perfil')
        .messages(joiMessagesSchema),
      manager_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .allow(null)
        .label('Gerente')
        .messages(joiMessagesSchema),
      first_name: Joi.string().label('Nome').messages(joiMessagesSchema),
      last_name: Joi.string().label('Sobrenome').messages(joiMessagesSchema),
      email: Joi.string()
        .email()
        .lowercase()
        .label('E-mail')
        .messages(joiMessagesSchema),
      password: Joi.string()
        .allow(null)
        .min(6)
        .label('Senha')
        .messages(joiMessagesSchema),
      repeat_password: Joi.string()
        .allow(null)
        .min(6)
        .valid(Joi.ref('password'))
        .label('Repita a senha')
        .messages(joiMessagesSchema),
      document: Joi.document().allow('', null).cpf(),
      birthday: Joi.date()
        .allow('', null)
        .format('YYYY-MM-DD')
        .error((errors: any) => {
          errors.forEach((err: JoiBase.ErrorReport) => {
            switch (err.code) {
              case 'date.base':
                err.message = 'A data de aniversário deve ser uma data válida.';
                break;
              case 'date.format':
                err.message =
                  'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.';
                break;
              default:
                break;
            }
          });
          return errors;
        }),
      phone: Joi.string()
        .allow('', null)
        .phoneNumber({ defaultCountry: 'BR', strict: true })
        .error((errors: any) => {
          errors.forEach((err: JoiBase.ErrorReport) => {
            switch (err.code) {
              case 'phoneNumber.invalid':
                err.message = 'Número de celular inválido.';
                break;
              default:
                break;
            }
          });
          return errors;
        }),
      permission_delete_ticket: Joi.boolean()
        .label('Permissão para deletar os tickets')
        .messages(joiMessagesSchema),
      visible: Joi.boolean()
        .label('Liberar o acesso')
        .messages(joiMessagesSchema),
      address: Joi.object()
        .keys({
          zipcode: Joi.string()
            .postalCode('BR')
            .label('CEP')
            .messages(joiMessagesSchema),
          street: Joi.string().label('Rua/Avenida').messages(joiMessagesSchema),
          number: Joi.string().label('Número').messages(joiMessagesSchema),
          complement: Joi.string()
            .allow('', null)
            .label('Complemento')
            .messages(joiMessagesSchema),
          neighborhood: Joi.string()
            .label('Bairro')
            .messages(joiMessagesSchema),
          state_id: Joi.string()
            .guid({ version: 'uuidv4' })
            .label('Estado')
            .messages(joiMessagesSchema),
          city_id: Joi.string()
            .guid({ version: 'uuidv4' })
            .label('Cidade')
            .messages(joiMessagesSchema),
        })
        .allow(null),
      limit: {
        general_limit: Joi.number()
          .min(0)
          .label('Limite de geral')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor mínimo não pode ser menor que 0',
            },
          }),
        agent_max: Joi.number()
          .min(0)
          .label('Máximo de agentes')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor mínimo não pode ser menor que 0',
            },
          }),
        daily_limit_single_bet: Joi.number()
          .min(0)
          .label('Limite diário de aposta simples')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor mínimo não pode ser menor que 0',
            },
          }),
        weekly_limit_single_bet: Joi.number()
          .min(0)
          .allow(null)
          .label('Limite semanal de aposta simples')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor mínimo não pode ser menor que 0',
            },
          }),
        daily_limit_double_bet: Joi.number()
          .min(0)
          .label('Limite diário de aposta dupla')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor mínimo não pode ser menor que 0',
            },
          }),
        daily_limit_triple_bet: Joi.number()
          .min(0)
          .label('Limite diário de aposta tripla')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor mínimo não pode ser menor que 0',
            },
          }),
      },
    });
  }
}
