export const authHeader = () => {
  let user = JSON.parse(getSession());
  if (user && user.access_token) {
    return { 'Authorization': 'Bearer ' + user.access_token };
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
