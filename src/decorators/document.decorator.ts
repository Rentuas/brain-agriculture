import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  import { validarCPF, validarCNPJ } from '../utils/document.validations';
  
  export function Document(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'document',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            if (typeof value !== 'string') {
              return false;
            }
  
            return validarCPF(value) || validarCNPJ(value);
          },
          defaultMessage(args: ValidationArguments) {
            return 'O campo document deve ser um CPF ou CNPJ válido, sem pontuações.';
          },
        },
      });
    };
  }