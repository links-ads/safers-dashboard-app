import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

// eslint-disable-next-line import/no-duplicates
import logodark from '../../assets/images/background-light-logo.png';
// eslint-disable-next-line import/no-duplicates
import logolight from '../../assets/images/background-light-logo.png';
import { SIGNIN_REDIRECT } from '../../config';
import AoiHelper from '../../helpers/aoiHelper';

const SelectArea = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(state => state.auth);
  const aoiSetSuccess = useSelector(state => state.user.aoiSetSuccess);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/sign-in');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (aoiSetSuccess) {
      navigate(SIGNIN_REDIRECT);
    }
  }, [aoiSetSuccess, navigate]);

  return (
    <div className="jumbotron">
      <Row>
        <Col xl={2} className="bg-overlay"></Col>
        <Col xl={10}>
          <Row>
            <div className="p-2">
              <div className="d-block auth-logo">
                <img src={logodark} alt="" className="auth-logo-dark" />
                <img src={logolight} alt="" className="auth-logo-light" />
              </div>
            </div>
            <Row>
              <Col
                xl={11}
                md={10}
                xs={12}
                className="mx-auto sign-up-aoi-map-bg mb-2.5"
              >
                <div className="d-flex justify-content-center">
                  <h5>Choose your area of interest</h5>
                </div>
                <hr />
                <AoiHelper />
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SelectArea;
