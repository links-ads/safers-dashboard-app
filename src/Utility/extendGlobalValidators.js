import wkt from 'wkt';
import * as Yup from 'yup';

export const extendGlobalValidators = () => {
  Yup.addMethod(Yup.array, 'isValidWKTString', function (message) {
    return this.test('isValidWKTString', message, value =>
      value.length ? typeof wkt.stringify(value[0]) === 'string' : false,
    );
  });

  // add more custom methods here...
};
