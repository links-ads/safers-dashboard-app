import React from 'react';
import { Card, CardBody, CardTitle, CardText, List } from 'reactstrap';

export const getGeneralErrors = (errors) => {
  if(!errors) return '';
  const errArr = Object.keys(errors);

  const getErrContainer = (error) => {
    if(Array.isArray(errors[error])){
      return <List>
        {errors[error].map((errorElem, index) => {
          return (<li key={`${error}-${index}`}>{error} - {errorElem}</li>);
        })}
      </List>
    }
    return <p>{error}</p>
  }
  return (
    <Card color="danger" className="text-white-50">
      <CardBody>
        <CardTitle className="mb-4 text-white">
          <i className="mdi mdi-alert-outline me-3" />Please fix the following error(s):
        </CardTitle>
        <CardText className="text-light">
          {errArr.map((error) => {
            return getErrContainer(error);
          })}
        </CardText>
      </CardBody>
    </Card>
  )
}
