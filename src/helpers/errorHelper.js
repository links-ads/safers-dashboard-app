import React from 'react';

import { Card, CardBody, CardTitle, List } from 'reactstrap';

const getErrorListItems = error => {
  // turns errors into individual ListItems; an error can either
  // be an array (of strings), or an object whose values can be
  // arrays or strings, or jut a string.
  if (error instanceof Object) {
    if (error instanceof Array) {
      return error.map(errorItem => getErrorListItems(errorItem));
    } else {
      return Object.entries(error).map(([key, value]) =>
        Array.isArray(value)
          ? value.map(valueItem => getErrorListItems(`${key} - ${valueItem}`))
          : getErrorListItems(`${key} - ${value}`),
      );
    }
  } else {
    return <li>{error}</li>;
  }
};

export const getGeneralErrors = errors => {
  if (!errors) return '';

  return (
    <Card color="danger" className="text-white-50">
      <CardBody>
        <CardTitle className="mb-4 text-white">
          <i className="mdi mdi-alert-outline me-3" />
          Please fix the following error(s):
        </CardTitle>
        <List className="text-white">{getErrorListItems(errors)}</List>
      </CardBody>
    </Card>
  );
};

export const getError = (
  key,
  errors,
  touched,
  errStyle = true,
  validateOnChange,
) => {
  if (errors[key] && (touched[key] || validateOnChange)) {
    return errStyle ? (
      'is-invalid'
    ) : (
      <div className="invalid-feedback d-block">{errors[key]}</div>
    );
  }
};
