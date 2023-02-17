import { rest } from 'msw';

import { sources } from 'mocks/fixtures/alerts';

const getSources = rest.get('*/alerts/sources', async (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(sources));
});

const handlers = [getSources];

export default handlers;
