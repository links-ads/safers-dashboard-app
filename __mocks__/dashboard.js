export const STATS = {
  'reports' : 35,
  'alerts' : 8,
  'events' : 12,
  'socialEngagement' : 20000,
}

export const WEATHER_STATS = {
  mapData : {
    atm_instability_index : 27,
    fire_weather_index : 14
  },
  forecast : {
    temp: [24, 48, 72],
    pressure: [23, 58, 92],
    precipitation: [3, 28, 9]
  }
}

export const weatherVariables = [
  {
    time : '16:00',
    wind : 5,
    humidity : 36
  },
  {
    time : '16:00',
    wind : 5,
    humidity : 36
  },
  {
    time : '16:00',
    wind : 12,
    humidity : 36
  },
  {
    time : '16:00',
    wind : 8,
    humidity : 36
  },
  {
    time : '16:00',
    wind : 15,
    humidity : 36
  },
  {
    time : '16:00',
    wind : 5,
    humidity : 36
  },
  {
    time : '16:00',
    wind : 5,
    humidity : 36
  },
  {
    time : '16:00',
    wind : 5,
    humidity : 36
  }
]

export const inSituMedia = [
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'video',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048',
    videoId : 'L61p2uyiMSo',
    channel: 'youtube'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'video',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048',
    videoId : 'L61p2uyiMSo',
    channel: 'youtube'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'video',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048',
    videoId : 'L61p2uyiMSo',
    channel: 'youtube'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  },
  {
    time : '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url : 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  }
]

export const tweets = [
  {
    tweetID : '1495718988952838147'
  },
  {
    tweetID : '1473967871512367105'
  },
  {
    tweetID : '1505942928463650827'
  },
  {
    tweetID : '1468979511907790861'
  },
  {
    tweetID : '1505038876254998531'
  },
  {
    tweetID : '1460306507082391562'
  },
  {
    tweetID : '1454004948941819910'
  },
  {
    tweetID : '1450820084864327684'
  },
  {
    tweetID : '1450380879084273664'
  },
  {
    tweetID : '1513339902674423812'
  },
  {
    tweetID : '1513270391870877696'
  }
]

module.exports = [
  {
    id: 'dashboard', // id of the route
    url: '/api/dashboard/stats/', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: {
          status: 200, // status to send
          body: stats, // body to send
        },
      },
      {
        id: 'error', // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: 'Error',
          },
        },
      },
    ],
  },
  {
    id: 'dashboardWeather', // id of the route
    url: '/api/dashboard/weatherstats/', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: {
          status: 200, // status to send
          body: weatherStats, // body to send
        },
      },
      {
        id: 'error', // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: 'Error',
          },
        },
      },
    ],
  },
  {
    id: 'dashboardWeatherVars', // id of the route
    url: '/api/dashboard/weathervariables/', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: {
          status: 200, // status to send
          body: weatherVariables, // body to send
        },
      },
      {
        id: 'error', // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: 'Error',
          },
        },
      },
    ],
  },
  {
    id: 'dashboardMedia', // id of the route
    url: '/api/dashboard/inSitu/', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: {
          status: 200, // status to send
          body: inSituMedia, // body to send
        },
      },
      {
        id: 'error', // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: 'Error',
          },
        },
      },
    ],
  },
  {
    id: 'dashboardTweets', // id of the route
    url: '/api/dashboard/tweets/', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: {
          status: 200, // status to send
          body: tweets, // body to send
        },
      },
      {
        id: 'error', // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: 'Error',
          },
        },
      },
    ],
  },
];
