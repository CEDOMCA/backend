import { ValidationOptions, registerDecorator } from 'class-validator';
import { differenceInYears } from 'date-fns';

export function BeetweenYearsOld(
  greaterThan: number,
  lessThan: number,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'beetweenYearsOld',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [greaterThan, lessThan],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const isString = typeof value === 'string';

          if (isString) {
            const userBirthDate = new Date(value);
            const today = new Date();
            const userYearsOld = differenceInYears(today, userBirthDate);

            return userYearsOld >= greaterThan && userYearsOld <= lessThan;
          }

          return false;
        },
      },
    });
  };
}
