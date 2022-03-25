//Base url for axios/API
export const BASE_URL = process.env.REACT_APP_API ? process.env.REACT_APP_API : 'https://safers-gateway.herokuapp.com'

//OAuth Config
export const CLIENT_BASE_URL = process.env.REACT_APP_CLIENT_BASE_URL ? process.env.REACT_APP_CLIENT_BASE_URL : 'http://localhost:3000'
export const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL ? process.env.REACT_APP_AUTH_BASE_URL : 'http://localhost:9011'
export const AUTH_CLIENT_ID  = process.env.REACT_APP_AUTH_CLIENT_ID ? process.env.REACT_APP_AUTH_CLIENT_ID  : '24c3750b-088a-43d0-af23-781258e6e78c'
export const AUTH_TENANT_ID  = process.env.REACT_APP_AUTH_TENANT_ID ? process.env.REACT_APP_AUTH_TENANT_ID  : null
export const REDIRECT_URL =  process.env.REACT_APP_REDIRECT_URL ? process.env.REACT_APP_REDIRECT_URL  : 'auth/sign-in'
