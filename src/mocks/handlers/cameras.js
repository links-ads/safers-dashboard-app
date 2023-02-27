import { rest } from 'msw';

import { sources } from 'mocks/fixtures/cameras';

const getSources = rest.get(
  '*/cameras/media/sources',
  async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sources));
  },
);

const handlers = [getSources];

export default handlers;
