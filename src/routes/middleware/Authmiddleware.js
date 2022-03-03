import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import Layout from '../../layout';
import { getSession } from '../../helpers/authHelper';

const Authmiddleware = ({
  component: Component,
  isAuthProtected,
  ...rest
}) => {
  if (isAuthProtected && !getSession()) {
    return (
      <Navigate state={{ from: rest.location }} to="/auth/sign-in" />
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
