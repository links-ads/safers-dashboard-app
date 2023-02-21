import React from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { isLoggedInSelector } from 'store/authentication/authentication.slice';
import { defaultAoiSelector } from 'store/user/user.slice';

import Layout from '../../layout';

const Authmiddleware = ({ component: Component, isAuthProtected, ...rest }) => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const defaultAoi = useSelector(defaultAoiSelector);

  if (isAuthProtected && !isLoggedIn) {
    return <Navigate state={{ from: rest.location }} to="/auth/sign-in" />;
  } else if (isLoggedIn && !defaultAoi) {
    return <Navigate state={{ from: rest.location }} to="/user/select-aoi" />;
  }

  return (
    <Layout>
      <Component {...rest} />
    </Layout>
  );
};

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
};

export default Authmiddleware;
