export const authHeader = () => {
  let user = JSON.parse(getSession());
  if (user && user.accessToken) {
    return { 'Authorization': 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
}

export const setSession = (user, rememberMe) => {
  if (rememberMe)
    localStorage.setItem('authUser', JSON.stringify(user));
  else
    sessionStorage.setItem('authUser', JSON.stringify(user));
}

export const getSession = () => {
  return sessionStorage.getItem('authUser') || localStorage.getItem('authUser');
}
  
export const deleteSession = () => {
  sessionStorage.removeItem('authUser');
  localStorage.removeItem('authUser');
}