import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class AreaConsistencyValidator implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
      const { totalArea, agriculturalArea, vegetationArea } = args.object as any;
      
      const isAnyAreaProvided = totalArea !== undefined || agriculturalArea !== undefined || vegetationArea !== undefined;
      
      if (isAnyAreaProvided) {
        return totalArea !== undefined && agriculturalArea !== undefined && vegetationArea !== undefined;
      }
      
      return true;
    }
  
    defaultMessage(args: ValidationArguments) {
      return `Se uma das áreas (total, agricultável ou vegetação) for informada, as outras duas também devem ser informadas.`;
    }
  }
  
  export function IsAreaConsistent(validationOptions?: ValidationOptions) {
    return function (object: Object) {
      registerDecorator({
          name: 'IsAreaConsistent',
          target: object.constructor,
          options: validationOptions,
          validator: AreaConsistencyValidator,
          propertyName: ''
      });
    };
  }
  