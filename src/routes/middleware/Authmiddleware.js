import React from 'react'
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import Layout from '../../layout';

const Authmiddleware = ({
  component: Component,
  isAuthProtected,
  ...rest
}) => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  if (isAuthProtected && !isLoggedIn) {
    return (
      <Navigate state={{ from: rest.location }} to="/auth/sign-in" />
    )
  }
  else if(isLoggedIn && !defaultAoi){
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
