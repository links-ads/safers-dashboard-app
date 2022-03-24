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
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const defaultAoi = useSelector(state => state.auth.defaultAoi);
  if (isAuthProtected && !isLoggedIn) {
    return (
      <Navigate state={{ from: rest.location }} to="/auth/sign-in" />
    )
  }
  else if(isLoggedIn && ! defaultAoi){
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
