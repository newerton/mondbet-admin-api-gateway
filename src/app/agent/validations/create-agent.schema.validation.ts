import * as JoiBase from 'joi';
import { CreateSchema } from 'src/common/schemas/joi/joi.create.schema.factory';
import joiMessagesSchema from 'src/common/schemas/joi/joi.messages.schema';
import dateValidator from 'joi-date-dayjs';
import documentValidator from 'cpf-cnpj-validator';
import phoneValidator from 'joi-phone-number';
import postalcodeValidator from 'joi-postalcode';
import { AgentResources } from '../entities/agent_role.entity';

const Joi = JoiBase.extend(dateValidator)
  .extend(documentValidator)
  .extend(phoneValidator)
  .extend(postalcodeValidator);

export class CreateAgentSchema implements CreateSchema {
  createSchema(): JoiBase.ObjectSchema {
    return Joi.object({
      profile_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
        .label('Perfil')
        .messages(joiMessagesSchema),
      manager_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .allow(null)
        .label('Gerente')
        .messages(joiMessagesSchema),
      submanager_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .allow(null)
        .label('Sub-Gerente')
        .messages(joiMessagesSchema),
      collect_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .allow(null)
        .label('Recolhe')
        .messages(joiMessagesSchema),
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
      document: Joi.document().allow('', null).cpf(),
      birthday: Joi.date()
        .allow('', null)
        .format('YYYY-MM-DD')
        .error((errors: any) => {
          errors.forEach((err: JoiBase.ErrorReport) => {
            switch (err.code) {
              case 'date.base':
                err.message = 'A data de anivers??rio deve ser uma data v??lida.';
                break;
              case 'date.format':
                err.message =
                  'O formato da data de anivers??rio est?? incorreta, o formato ?? Dia/M??s/Ano.';
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
                err.message = 'N??mero de celular inv??lido.';
                break;
              default:
                break;
            }
          });
          return errors;
        }),
      description: Joi.string()
        .allow('', null)
        .label('Observa????o')
        .messages(joiMessagesSchema),
      visible: Joi.boolean()
        .required()
        .label('Liberar o acesso')
        .messages(joiMessagesSchema),
      address: Joi.object()
        .keys({
          zipcode: Joi.string()
            .postalCode('BR')
            .required()
            .label('CEP')
            .messages(joiMessagesSchema),
          street: Joi.string()
            .required()
            .label('Rua/Avenida')
            .messages(joiMessagesSchema),
          number: Joi.string()
            .required()
            .label('N??mero')
            .messages(joiMessagesSchema),
          complement: Joi.string()
            .allow('', null)
            .label('Complemento')
            .messages(joiMessagesSchema),
          neighborhood: Joi.string()
            .required()
            .label('Bairro')
            .messages(joiMessagesSchema),
          state_id: Joi.string()
            .guid({ version: 'uuidv4' })
            .required()
            .label('Estado')
            .messages(joiMessagesSchema),
          city_id: Joi.string()
            .guid({ version: 'uuidv4' })
            .required()
            .label('Cidade')
            .messages(joiMessagesSchema),
        })
        .allow(null),
      limit: {
        general_limit: Joi.number()
          .min(0)
          .required()
          .label('Limite de caixa geral')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor m??nimo n??o pode ser menor que 0',
            },
          }),
        reward_percentage: Joi.number()
          .min(0)
          .required()
          .label('Percentual de pr??mio')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor m??nimo n??o pode ser menor que 0',
            },
          }),
        daily_limit_single_bet: Joi.number()
          .min(0)
          .required()
          .label('Limite di??rio de aposta simples')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor m??nimo n??o pode ser menor que 0',
            },
          }),
        daily_limit_double_bet: Joi.number()
          .min(0)
          .required()
          .label('Limite di??rio de aposta dupla')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor m??nimo n??o pode ser menor que 0',
            },
          }),
        daily_limit_triple_bet: Joi.number()
          .min(0)
          .required()
          .label('Limite di??rio de aposta tripla')
          .messages({
            ...joiMessagesSchema,
            ...{
              'number.min': 'O valor m??nimo n??o pode ser menor que 0',
            },
          }),
      },
      roles: Joi.array()
        .items(
          Joi.object({
            title: Joi.string()
              .required()
              .label('T??tulo')
              .messages(joiMessagesSchema),
            resource: Joi.string()
              .required()
              .valid(...Object.values(AgentResources))
              .label('Resource')
              .messages(joiMessagesSchema),
            create: Joi.boolean()
              .allow('')
              .required()
              .label('Create')
              .messages(joiMessagesSchema),
            read: Joi.boolean()
              .allow('')
              .required()
              .label('Read')
              .messages(joiMessagesSchema),
            update: Joi.boolean()
              .allow('')
              .required()
              .label('Update')
              .messages(joiMessagesSchema),
          }),
        )
        .allow(null),
    });
  }
}
