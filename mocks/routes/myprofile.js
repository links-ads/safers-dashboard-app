const MYPROFILE = {
  "user": {
      "id": 8,
      "name": "Nina Rollings",
      "title": "Research Analyst",
      "email": "abc@gmail.com",
      "location": "London",
      "company": "Safers",
      "aoi": "00967"
  }
};


module.exports = [
  {
    id: "myprofile", // id of the route
    url: "/api/myprofile/view/", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: {
          status: 200, // status to send
          body: MYPROFILE, // body to send
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
    id: "myprofile", // id of the route
    url: "/api/myprofile/update/", // url in express format
    method: "POST", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: {
          status: 200, // status to send
          body: MYPROFILE, // body to send
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
  }
];
