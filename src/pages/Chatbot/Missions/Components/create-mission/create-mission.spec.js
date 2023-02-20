import React from 'react';

import { server, rest } from 'mocks/server';
import { screen, render } from 'test-utils';

import CreateMission from './CreateMission';

const state = {
  common: {
    orgList: [],
    teamList: [],
  },
  user: {
    info: {},
  },
};

describe('CreateMission', () => {
  it('renders', () => {
    server.use(
      rest.get('*/teams', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      }),
    );
    render(<CreateMission />, { state });
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});
