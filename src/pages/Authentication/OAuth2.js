import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from 'reactstrap';

import {
  signInOauth2,
  isLoggedInSelector,
} from 'store/authentication/authentication.slice';
import { setLoading } from 'store/common/common.slice';

import {
  AUTH_BASE_URL,
  CLIENT_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_TENANT_ID,
  REDIRECT_URL,
} from '../../config';
/* 
The `authorize` fn gets the authorization_code from the Authentication Server
which redirects back to this page w/ that code.  It is run when the SSO button
is clicked.

The `OAuth2` component looks for a code; if it finds one it calls `signInOauth2`
which tries to exchange that code for a token from the API.
*/

const OAuth2 = () => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const dispatch = useDispatch();

  const authorize = () => {
    dispatch(
      setLoading({
        status: true,
        message:
          'Please wait. You are being redirected to sign in page for SSO.',
      }),
    );

    const params = {
      response_type: 'code',
      client_id: AUTH_CLIENT_ID,
      redirect_uri: `${CLIENT_BASE_URL}/${REDIRECT_URL}`,
      locale: 'en',
      tenant_id: AUTH_TENANT_ID,
      // state: 'whatever',
      scope: 'offline_access',
    };
    const urlParams = new URLSearchParams(params).toString();
    console.log(urlParams);
    window.location = `${AUTH_BASE_URL}/oauth2/authorize?${urlParams}`;
  };

  // check if we've been passed a code
  const location = useLocation();
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const authCode = params.get('code');
  useEffect(() => {
    if (!isLoggedIn && authCode) {
      console.log(authCode);
      dispatch(
        setLoading({
          status: true,
          message: 'You have successfully signed in. Please wait.',
        }),
      );
      dispatch(signInOauth2(authCode));
    }
  }, [authCode, dispatch, isLoggedIn]);

  return (
    <div className="text-center">
      <Button
        className="my-4 sign-in-btn"
        color="primary"
        onClick={() => {
          authorize();
        }}
      >
        SSO SIGN IN
      </Button>
    </div>
  );
};

export default OAuth2;
