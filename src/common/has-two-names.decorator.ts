import { ValidationOptions, registerDecorator } from 'class-validator';

export function HasNames(totalNames: number, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'hasTwoNames',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [totalNames],
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().split(' ').length >= totalNames;
        },
      },
    });
  };
}
