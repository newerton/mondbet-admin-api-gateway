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

export class CreateClientSchema implements CreateSchema {
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
      visible: Joi.boolean()
        .required()
        .label('Liberar o acesso')
        .messages(joiMessagesSchema),
      address: {
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
          .label('Número')
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
      },
    });
  }
}
