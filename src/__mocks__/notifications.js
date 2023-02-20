const notification = {
  id: 'db9634fc-ae64-44bf-ba31-7abf4f68daa9',
  title: 'Notification db9634c [Met]',
  type: 'RECOMMENDATION',
  timestamp: '2022-04-28T11:38:28Z',
  status: 'Actual',
  source: 'EFFIS_FWI',
  scope: 'Public',
  category: 'Met',
  event: 'Probability of fire',
  description: 'Do not light open-air barbecues in forest.',
  geometry: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [1, 2],
            [3, 4],
          ],
        },
        properties: {
          description: 'areaDesc',
        },
      },
    ],
  },
  center: [1, 2],
  bounding_box: [1, 2, 3, 4],
};

var NOTIFICATIONS = [];

for (let i = 0; i < 10; i++) {
  NOTIFICATIONS[i] = notification;
}

export const NOTIFICATION_DATA = NOTIFICATIONS;
