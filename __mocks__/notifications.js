const notification = {
  'id': '83157f8c-eae4-4a82-9552-9be7613985db',
  'timestamp': '2022-03-15T10:01:04Z',
  'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie eu leo nec aliquet. Duis in tincidunt massa. Etiam non tellus sagittis, ullamcorper dui sit amet, rutrum eros. Nulla posuere in velit vel sagittis. Quisque quis luctus felis. Suspendisse laoreet dui non rhoncus euismod. Etiam ut velit non nulla laoreet lobortis id quis quam. Cras eget tortor quis neque efficitur mollis. Suspendisse nulla turpis, imperdiet et sollicitudin sed, rutrum vel tortor. Donec tellus felis, gravida ac venenatis quis, vehicula sed augue. Sed lobortis fringilla sem, a placerat ex varius at. Phasellus aliquet ante a libero malesuada, efficitur mollis tellus rhoncus..',
  'source': 'CERTH',
  'status': 'RECOMMENDATION',
}

var NOTIFICATIONS = []

for (let i = 0; i < 10; i++) {
  NOTIFICATIONS[i] = notification
}

export const NOTIFICATION_DATA = NOTIFICATIONS