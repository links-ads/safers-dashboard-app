import { rest } from 'msw';

import { OK } from 'api/constants';
import { sources } from 'mocks/fixtures/alerts';

const getSources = rest.get('*/alerts/sources', async (req, res, ctx) => {
  return res(ctx.status(OK), ctx.json(sources));
});

const handlers = [getSources];

export default handlers;
