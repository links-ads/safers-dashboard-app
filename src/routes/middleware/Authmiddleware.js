import React from 'react'
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import Layout from '../../layout';
// To Do - use the following
// import { getSession } from '../../helpers/authHelper';

const Authmiddleware = ({
  component: Component,
  isAuthProtected,
  ...rest
}) => {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  if (isAuthProtected && !isLoggedIn) {
    return (
      <Navigate state={{ from: rest.location }} to="/auth/sign-in" />
    )
  }
  else if(isLoggedIn && ! user.default_aoi){
    return (
      <Navigate state={{ from: rest.location }} to="/user/select-aoi" />
    )
  }

  return (
    <Layout>
      <Component {...rest} />
    </Layout>
  )
}

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
}

export default Authmiddleware;
