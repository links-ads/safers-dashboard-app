const ALERTS = [
  {
    id: '9953b183-5f18-41b1-ac96-23121ac33de7',
    date: '2022-03-11T10:01:04Z',
    tags: ['Fire', 'Photo'],
    source: ['camera'],
    sourceInfo: {
      camNo: 10,
      camLocation: 'Lat. 1234, Long. 1234',
      lastUploadedFeed: '2022-02-11T10:01:04Z',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      SmokeColumn: 'CL1',
      GeoInfo: '90',
    },
    media: {
      type: 'Photo',
      url: 'https://st3.depositphotos.com/3589679/34560/i/380/depositphotos_345604100-stock-photo-blaze-fire-flame-texture-background.jpg',
    },
    location: 'Filoktiti Oikonomidou, Athens 114 76, Greece',
    people_affected: 120,
    casualties: null,
    damage: 20000,
    geometry: {
      type: 'Polygon',
      coordinates: [21.05495311720281, 40.3205346284964],
    },
    bounding_box: {
      type: 'Polygon',
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
  },
  {
    id: '83157f8c-eae4-4a82-9552-9be7613985db',
    date: '2022-03-11T10:01:04Z',
    tags: ['Smoke', 'Photo'],
    source: ['camera', 'web'],
    sourceInfo: {
      camNo: 11,
      camLocation: 'Lat. 1234, Long. 1234',
      lastUploadedFeed: '2022-03-11T10:01:04Z',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      SmokeColumn: 'CL2',
      GeoInfo: '0',
    },
    media: {
      type: 'Photo',
      url: 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048',
    },
    people_affected: 120,
    casualties: null,
    damage: 20000,
    geometry: {
      type: 'Polygon',
      coordinates: [22.21873260115854, 38.78619650289218],
    },
    bounding_box: {
      type: 'Polygon',
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
  },
  {
    id: '4df44289-c25d-4b6b-b664-ac225107e568',
    date: '2022-03-11T10:01:04Z',
    tags: ['Fire', 'Photo'],
    source: ['camera', 'web'],
    sourceInfo: {
      camNo: 12,
      camLocation: 'Lat. 1234, Long. 1234',
      lastUploadedFeed: '2022-03-11T10:01:04Z',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
      SmokeColumn: 'CL1',
      GeoInfo: '180',
    },
    media: {
      type: 'Photo',
      url: 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048',
    },
    people_affected: 120,
    casualties: null,
    damage: 20000,
    geometry: {
      type: 'Polygon',
      coordinates: [22.16586216261809, 39.924930600577156],
    },
    bounding_box: {
      type: 'Polygon',
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
  },
  {
    id: 'f57b71ec-4dcf-42e3-b323-2a04f687f4c1',
    date: '2022-03-11T10:01:04Z',
    tags: ['Smoke', 'Video'],
    source: ['camera'],
    sourceInfo: {
      camNo: 13,
      camLocation: 'Lat. 1234, Long. 1234',
      lastUploadedFeed: '2022-03-11T10:01:04Z',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      SmokeColumn: 'CL1',
      GeoInfo: '270',
    },
    media: {
      type: 'Video',
      videoId: 'L61p2uyiMSo',
      channel: 'youtube',
    },
    location: 'Filoktiti Oikonomidou, Athens 114 76, Greece',
    people_affected: 120,
    casualties: null,
    damage: 20000,
    geometry: {
      type: 'Polygon',
      coordinates: [22.63791911947724, 37.070991983218285],
    },
    bounding_box: {
      type: 'Polygon',
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
  },
  {
    id: 'd0114f11-9078-4126-a860-a19cc0d98918',
    date: '2022-03-11T10:01:04Z',
    tags: ['Fire', 'Video'],
    source: ['camera'],
    sourceInfo: {
      camNo: 14,
      camLocation: 'Lat. 1234, Long. 1234',
      lastUploadedFeed: '2022-03-11T10:01:04Z',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
      SmokeColumn: 'CL1',
      GeoInfo: '90',
    },
    media: {
      type: 'Video',
      videoId: 'L61p2uyiMSo',
      channel: 'youtube',
    },
    location: 'Filoktiti Oikonomidou, Athens 114 76, Greece',
    people_affected: 120,
    casualties: null,
    damage: 20000,
    geometry: {
      type: 'Polygon',
      coordinates: [20.687682125897837, 39.23554570177934],
    },
    bounding_box: {
      type: 'Polygon',
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
  },
  {
    id: '8a795812-9fd5-41fe-9a5f-1ee23ae0264a',
    date: '2022-03-11T10:01:04Z',
    tags: ['Fire', 'Photo'],
    source: ['camera', 'web'],
    sourceInfo: {
      camNo: 15,
      camLocation: 'Lat. 1234, Long. 1234',
      lastUploadedFeed: '2022-03-11T10:01:04Z',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      SmokeColumn: 'CL1',
      GeoInfo: '90',
    },
    media: {
      type: 'Photo',
      url: 'https://st3.depositphotos.com/3589679/34560/i/380/depositphotos_345604100-stock-photo-blaze-fire-flame-texture-background.jpg',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [23.894943911547475, 38.43680100760241],
    },
    bounding_box: {
      type: 'Polygon',
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
  },
];

module.exports = [
  {
    id: 'insitu-alerts', // id of the route
    url: '/api/insitu-alerts', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: {
          status: 200, // status to send
          body: ALERTS, // body to send
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
