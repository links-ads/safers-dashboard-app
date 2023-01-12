export const MOCK_REPORTS = [
  {
    name: 'MOCK 123',
    report_id: '123',
    mission_id: '4404',
    timestamp: '2023-01-01T13:19:15.004Z',
    source: 'Chatbot',
    hazard: 'Fire',
    status: 'Notified',
    content: 'Submitted',
    visibility: 'Private',
    description: 'This is mock data.',
    reporter: {
      name: 'first.responder.test.2',
      organization: 'Test Organization',
    },
    media: [
      {
        url: 'https://safersblobstoragetest.blob.core.windows.net/reports/000019/113b8271-30b1-4987-a5d0-6ebac839bae2.jpeg',
        thumbnail:
          'https://safersblobstoragetest.blob.core.windows.net/thumbnails/000019/113b8271-30b1-4987-a5d0-6ebac839bae2.jpeg',
        type: 'Image',
      },
    ],
    categories: ['People'],
    categories_info: [
      'Infected: 1',
      'Dead: 0',
      'Evacuated: 15',
      'Missing: 0',
      'Injured: 5',
      'Recovered: 1',
      'Rescued: 25',
      'Hospitalized: 2',
    ],
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
    },
    location: [1, 2],
  },
  {
    name: 'MOCK 456',
    report_id: '456',
    mission_id: '456',
    timestamp: '2023-04-04T08:19:15.004Z',
    source: 'Chatbot',
    hazard: 'Fire',
    status: 'Notified',
    content: 'Submitted',
    visibility: 'Private',
    description: 'More mock data!',
    reporter: {
      name: 'first.responder.test.2',
      organization: 'Test Organization',
    },
    media: [
      {
        url: 'https://safersblobstoragetest.blob.core.windows.net/reports/000019/113b8271-30b1-4987-a5d0-6ebac839bae2.jpeg',
        thumbnail:
          'https://safersblobstoragetest.blob.core.windows.net/thumbnails/000019/113b8271-30b1-4987-a5d0-6ebac839bae2.jpeg',
        type: 'Image',
      },
    ],
    categories: ['People'],
    categories_info: [
      'Infected: 0',
      'Dead: 3',
      'Evacuated: 25',
      'Missing: 2',
      'Injured: 5',
      'Recovered: 1',
      'Rescued: 25',
      'Hospitalized: 2',
    ],
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
    },
    location: [1, 2],
  },
];
