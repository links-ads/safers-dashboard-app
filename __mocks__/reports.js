export const REPORTS = [
  {
    'id': '9953b183-5f18-41b1-ac96-23121ac33de7',
    'name': 'Report A',
    'date': '2022-03-11T10:01:04Z',
    'source': ['chatbot'],
    'location' : 'Lat. 1234, Long. 1234',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        21.05495311720281,
        40.3205346284964
      ]
    },
    'bounding_box': {
      'type': 'Polygon',
      'coordinates': [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    'id': '83157f8c-eae4-4a82-9552-9be7613985db',
    'name': 'Report B',
    'date': '2022-03-11T10:01:04Z',
    'tags': ['Smoke', 'Photo'],
    'source': ['chatbot'],
    'location' : 'Lat. 1234, Long. 1234',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        22.21873260115854,
        38.78619650289218
      ]
    },
    'bounding_box': {
      'type': 'Polygon',
      'coordinates': [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    'id': '4df44289-c25d-4b6b-b664-ac225107e568',
    'name': 'Report C',
    'date': '2022-03-11T10:01:04Z',
    'location' : 'Lat. 1234, Long. 1234',
    'source': ['chatbot'],
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        22.16586216261809,
        39.924930600577156
      ]
    },
    'bounding_box': {
      'type': 'Polygon',
      'coordinates': [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    'id': 'f57b71ec-4dcf-42e3-b323-2a04f687f4c1',
    'name': 'Report D',
    'date': '2022-03-11T10:01:04Z',
    'location' : 'Lat. 1234, Long. 1234',
    'source': ['chatbot'],
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        22.63791911947724, 37.070991983218285
      ]
    },
    'bounding_box': {
      'type': 'Polygon',
      'coordinates': [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    'id': 'd0114f11-9078-4126-a860-a19cc0d98918',
    'name': 'Report E',
    'date': '2022-03-11T10:01:04Z',
    'tags': ['Fire', 'Video'],
    'source': ['chatbot'],
    'location' : 'Lat. 1234, Long. 1234',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        20.687682125897837, 39.23554570177934
      ]
    },
    'bounding_box': {
      'type': 'Polygon',
      'coordinates': [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    'id': '8a795812-9fd5-41fe-9a5f-1ee23ae0264a',
    'name': 'Report F',
    'date': '2022-03-11T10:01:04Z',
    'location' : 'Lat. 1234, Long. 1234',
    'source': ['chatbot'],
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        23.894943911547475, 38.43680100760241
      ]
    },
    'bounding_box': {
      'type': 'Polygon',
      'coordinates': [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ]
    }
  },
]

export const REPORTINFO = {
  id: '1234',
  name: 'Report A',
  hazardType: 'Fire',
  status: 'Notified',
  userName: 'organization manager',
  organization: 'Test Organization',
  location: 'Filoktiti Oikonomidou, Athens 114 76, Greece',
  date:'2022-03-11T10:01:04Z',
  source: 'chatbot',
  reportPrivacy: 'Public',
  passportID: '1234',
  missionId: 'EZ123',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  media: [
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

}

