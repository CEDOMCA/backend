import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

import { AttributesDomain } from '@/resources/font/font.constants';

export function IsDomainAnObjectList(domain: string, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'hasTwoNames',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [domain],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [domainName] = args.constraints;
          const relatedDomain = (args.object as any)[domainName];

          if (relatedDomain === AttributesDomain.object_list) {
            return value !== undefined;
          }

          return value === undefined;
        },
      },
    });
  };
}
