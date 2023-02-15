import React from 'react';

import { screen, render } from 'test-utils';

import CreateMission from '../Components/CreateMission';

describe('CreateMission', () => {
  it('renders', () => {
    render(<CreateMission />);
    expect(
      screen.getByRole('button', { name: /submit/i }),
    ).toBeInTheDocumentOfDocument();
  });
});

// 97300016919
