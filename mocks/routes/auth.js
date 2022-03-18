// users data
const USERS = {
  "token": "46aef085736533590993d66cf79d507034fecd09c49d7f2b019e53568165a5dca9c34762cdf52969af5f38aff97b65baea27a72a7e14c1dddda028f68272896c",
  "expiry": "2022-03-17T17:23:37.165114Z",
  "user": {
    "id": "150aa5c1-cd62-444d-acb1-92eee38165f5",
    "email": "admin@astrosat.net",
    "accepted_terms": true,
    "is_verified": true,
    "last_login": "2022-03-17T07:23:37.237936Z"
  }
};

const LOGOUT = {
  "detail": "Successfully logged out."
}

module.exports = [
  {
    id: "login", // id of the route
    url: "/api/auth/login/", // url in express format
    method: "POST", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: {
          status: 200, // status to send
          body: USERS, // body to send
        },
      },
      {
        id: "error", // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: "Error",
          },
        },
      },
    ],
  },
  {
    id: "logout", // id of the route
    url: "/api/auth/logout/", // url in express format
    method: "POST", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: {
          status: 200, // status to send
          body: LOGOUT, // body to send
        },
      },
      {
        id: "error", // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: "Error",
          },
        },
      },
    ],
  },
];
