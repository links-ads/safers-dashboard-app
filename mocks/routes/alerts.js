const ALERTS = [
  {
    'id': '9953b183-5f18-41b1-ac96-23121ac33de7',
    'timestamp': '2022-03-19T10:01:04Z',
    'title': 'EMSR192: Fires in Athens, Greece',
    'description': 'This is another card with title and supporting text below.This card has some additional content to make it slightly taller overall.',
    'source': 'web',
    'status': 'UNVALIDATED',
    'media': [
      'http://some.image.com',
      'http://another.image.com'
    ],
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
    'timestamp': '2022-03-19T10:01:04Z',
    'title': 'EMSR192: Fires in Athens, Greece',
    'description': 'This is another card with title and supporting text below.This card has some additional content to make it slightly taller overall.',
    'source': 'web',
    'status': 'UNVALIDATED',
    'media': [
      'http://some.image.com',
      'http://another.image.com'
    ],
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
    'timestamp': '2022-03-19T10:01:04Z',
    'title': 'EMSR192: Fires in Athens, Greece',
    'description': 'This is another card with title and supporting text below.This card has some additional content to make it slightly taller overall.',
    'source': 'web',
    'status': 'UNVALIDATED',
    'media': [
      'http://some.image.com',
      'http://another.image.com'
    ],
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
  }
]

module.exports = [
  {
    id: 'alerts', // id of the route
    url: '/api/alerts/', // url in express format
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
