import Cookies from 'js-cookie';

export const authHeader = () => {
  let sessionObj = getSession();
  if (sessionObj && sessionObj.access_token) {
    return { 'Authorization': 'Bearer ' + /*sessionObj.access_token*/'a85e9b47dd06412407e521173f8e2d1a3702e2aefb83a6680cfd7f4a96f0851a' };
  } else {
    return {};
  }
}

export const setSession = (sessionObj, rememberMe) => {
  if (rememberMe) {
    Cookies.set('authUser', JSON.stringify(sessionObj), { expires: 1 });
  }
  sessionStorage.setItem('authUser', JSON.stringify(sessionObj));
}

export const getSession = () => {
  const cookieVal = Cookies.get('authUser') || null;
  return JSON.parse(sessionStorage.getItem('authUser') || cookieVal);
}

export const deleteSession = () => {
  sessionStorage.removeItem('authUser');
  Cookies.remove('authUser');
}

export const deleteCookie = () => {
  Cookies.remove('authUser');
}
