import Cookies from 'js-cookie';

export const authHeader = () => {
  let sessionObj = getSession();
  if (sessionObj && sessionObj.access_token) {
    return { Authorization: 'Bearer ' + sessionObj.access_token };
  } else {
    return {};
  }
};

export const setSession = (sessionObj, rememberMe) => {
  if (rememberMe) {
    Cookies.set('authUser', JSON.stringify(sessionObj), { expires: 1 });
  }
  sessionStorage.setItem('authUser', JSON.stringify(sessionObj));
};

export const getSession = () => {
  const cookieVal = Cookies.get('authUser') || null;
  return JSON.parse(sessionStorage.getItem('authUser') || cookieVal);
};

export const deleteSession = () => {
  sessionStorage.removeItem('authUser');
  Cookies.remove('authUser');
};

export const deleteCookie = () => {
  Cookies.remove('authUser');
};
