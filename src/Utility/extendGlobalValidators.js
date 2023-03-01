import wkt from 'wkt';

export const extendGlobalValidators = Yup => {
  Yup.addMethod(Yup.array, 'isValidWKTString', function (message) {
    return this.test('isValidWKTString', message, value =>
      value.length ? typeof wkt.stringify(value[0]) === 'string' : false,
    );
  });

  // add more custom methods here...
};
