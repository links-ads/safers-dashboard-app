import { rest } from 'msw';

import { photos } from 'mocks/fixtures/photos';

const getSources = rest.get('*/cameras/media/', async (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(photos));
});

const handlers = [getSources];

export default handlers;
