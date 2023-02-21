import React, { useEffect } from 'react';

import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
} from 'reactstrap';

import {
  isUserRembembered,
  userSelector,
  isLoggedInSelector,
} from 'store/authentication/authentication.slice';
import {
  fetchAois,
  aoisSelector,
  isLoadingSelector,
} from 'store/common/common.slice';
import {
  setDefaultAoi,
  setUserInfo,
  defaultAoiSelector,
} from 'store/user/user.slice';

import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import SignIn from './SignIn';
import SignUp from './SignUp';
// eslint-disable-next-line import/no-duplicates
import logodark from '../../assets/images/background-light-logo.png';
// eslint-disable-next-line import/no-duplicates
import logolight from '../../assets/images/background-light-logo.png';
import PreLoader from '../../components/PreLoader';
import { SIGNIN_REDIRECT } from '../../config';

const Authentication = () => {
  const DEFAULT_PAGE = 'sign-in';
  const { currentPage } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const user = useSelector(userSelector);
  const allAoi = useSelector(aoisSelector);
  const isLoading = useSelector(isLoadingSelector);
  const defaultAoi = useSelector(defaultAoiSelector);

  useEffect(() => {
    if (!currentPage) {
      navigate(`/auth/${DEFAULT_PAGE}`);
    }
    dispatch(fetchAois());
  }, [currentPage, dispatch, navigate]);

  // AOI ID is filetered and complete object is stored in user store.
  // User info is recorded in user store
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setUserInfo(user));
      if (user?.default_aoi) {
        const objAoi = _.find(allAoi, {
          features: [{ properties: { id: user.default_aoi } }],
        });
        dispatch(setDefaultAoi(objAoi));
      } else {
        navigate('/user/select-aoi');
      }
    } else {
      dispatch(isUserRembembered());
    }
  }, [allAoi, dispatch, isLoggedIn, navigate, user]);

  useEffect(() => {
    if (defaultAoi) {
      navigate(SIGNIN_REDIRECT);
    }
  }, [defaultAoi, navigate]);

  const toggleTab = tab => {
    if (currentPage !== tab) {
      navigate(`/auth/${tab}`);
    }
  };
  const getMarkup = currentPage => {
    switch (currentPage) {
      case 'forgot-password':
        return <ForgotPassword />;
      case 'password':
        return <ResetPassword />;
      default:
        return (
          <>
            <div className="tab-container">
              <Nav tabs className="nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={currentPage === 'sign-in' ? 'active' : ''}
                    onClick={() => toggleTab('sign-in')}
                  >
                    SIGN IN
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={currentPage === 'sign-up' ? 'active' : ''}
                    onClick={() => toggleTab('sign-up')}
                  >
                    SIGN UP
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={currentPage}>
                <TabPane title="SIGN IN" tabId="sign-in">
                  <SignIn />
                </TabPane>
                <TabPane title="SIGN UP" tabId="sign-up">
                  <SignUp />
                </TabPane>
              </TabContent>
            </div>
          </>
        );
    }
  };

  return (
    <div>
      <PreLoader isLoading={isLoading} loadingMsg="Please wait.." />
      <Container fluid="true" className="p-0" data-test="containerComponent">
        <Row className="g-0">
          <Col xl={7} className="bg-overlay">
            <p data-test="overlay-text">
              {' '}
              Structured Approaches for<br></br>
              Forest fire Emergencies<br></br> in Resilient Societies
            </p>
          </Col>
          <Col xl={5}>
            <div className="auth-full-page-content">
              <div className="w-100">
                <div className="mb-4 mb-md-5">
                  <div className="d-block auth-logo">
                    <img src={logodark} alt="" className="auth-logo-dark" />
                    <img src={logolight} alt="" className="auth-logo-light" />
                  </div>
                </div>
                {getMarkup(currentPage)}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Authentication;
