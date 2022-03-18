import React from 'react';
import { Row, Col, Progress, List } from 'reactstrap';

const PWD_MIN_LENGTH = 8;

export const passwordHelper = (password) => {
  let chkUpperCase = false, chkLowerCase = false, hasNumber = false, chkLength = false, pswStrengthColor = 'Secondary';
  let strengthScore = 0, pswStrength = 'Weak';

  if (password.length >= PWD_MIN_LENGTH) {
    strengthScore++;
    chkLength = true;
  }

  if (password.match(/(?=.*[A-Z])/)) {
    strengthScore++;
    chkUpperCase = true;
  }
  if (password.match(/(?=.*[a-z])/)) {
    strengthScore++;
    chkLowerCase = true;
  }
  if (password.match(/(?=.*[0-9])/)) {
    strengthScore++
    hasNumber = true;
  }

  switch (strengthScore) {
  case 1:
  case 2:
    pswStrengthColor = 'danger';
    break;
  case 3:
    pswStrengthColor = 'warning';
    pswStrength = 'Average';
    break;
  case 4:
    pswStrengthColor = 'success';
    pswStrength = 'Strong';
    break;
  default:
    pswStrengthColor = 'Secondary';
    pswStrength = 'Weak';
  }

  const iconClass = 'float-start fs-4 fw-bold me-1';
  const successIcon = 'bx bx-check-circle text-success';
  const errorIcon = 'bx bx-x-circle text-danger';
  return (<>
    <Row className='mt-2'>
      <Col>
        <Progress id="pswStrength" multi width={25}>
          <Progress bar color={strengthScore > 0 ? pswStrengthColor : ''} value={25} className="rounded grey" />
          <Progress bar color={strengthScore > 1 ? pswStrengthColor : ''} value={25} className="ms-2 rounded grey" />
          <Progress bar color={strengthScore > 2 ? pswStrengthColor : ''} value={25} className="ms-2 rounded grey" />
          <Progress bar color={strengthScore > 3 ? pswStrengthColor : ''} value={25} className="ms-2 rounded grey" />
        </Progress>
      </Col>
      <Col>
        <span color={pswStrengthColor} className="float-end">{pswStrength}</span>
      </Col>
    </Row>
    <Row>
      <Col>
        <List id="pswInstructions" type="unstyled" className='mt-3'>
          <li className='mb-1'><i className={`${iconClass} ${chkLength ? successIcon : errorIcon}`}></i><span className={!chkLength ? 'text-white' : ''}>{PWD_MIN_LENGTH} characters long</span></li>
          <li className='mb-1'><i className={`${iconClass} ${chkUpperCase ? successIcon : errorIcon}`}></i><span className={!chkUpperCase ? 'text-white' : ''}>Uppercase letter</span></li>
          <li className='mb-1'><i className={`${iconClass} ${chkLowerCase ? successIcon : errorIcon}`}></i><span className={!chkLowerCase ? 'text-white' : ''}>Lowercase letter</span></li>
          <li className='mb-1'><i className={`${iconClass} ${hasNumber ? successIcon : errorIcon}`}></i><span className={!hasNumber ? 'text-white' : ''}>Must contain number</span></li>
        </List>
      </Col>
    </Row>
  </>)
}

export const pwdRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
export const pwdValidationTxt = 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number'
