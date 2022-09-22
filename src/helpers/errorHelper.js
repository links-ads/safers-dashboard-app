import React from 'react';
import { Card, CardBody, CardTitle, List } from 'reactstrap';

export const getGeneralErrors = (errors) => {
  if(!errors) return '';
  const errArr = Object.keys(errors);

  const getErrContainer = (error) => {
    if(Array.isArray(errors[error])) {
      return errors[error].map((errorElem, index) => {
        return (<li key={index}>{error} - {errorElem}</li>);
      })
    }
    return <p>{error}</p>
  }
  return (
    <Card color="danger" className="text-white-50">
      <CardBody>
        <CardTitle className="mb-4 text-white">
          <i className="mdi mdi-alert-outline me-3" />Please fix the following error(s):
        </CardTitle>
        <List className="text-white">{
          errArr.map((error) => {
            return getErrContainer(error);
          })}
        </List>
      </CardBody>
    </Card>
  )
}

export const getError = (key, errors, touched, errStyle=true, validateOnChange) => {
    
  if(errors[key] && (touched[key] || validateOnChange)){
    return (errStyle ? 'is-invalid': <div className="invalid-feedback d-block">{errors[key]}</div> )
  }
}
