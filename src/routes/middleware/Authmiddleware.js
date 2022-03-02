import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import Layout from '../../layout';

const Authmiddleware = ({
  component: Component,
  isAuthProtected,
  ...rest
}) => {
  if (isAuthProtected && !localStorage.getItem('authUser')) {
    return (
      <Navigate state={{ from: rest.location }}  to="/login" />
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
