import '@testing-library/jest-dom';

import { server } from 'mocks/server';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

window.scrollTo = (x, y) => {
  document.documentElement.scrollTop = y;
};

jest.mock('components/BaseMap/BaseMap', () => () => {
  return <div />;
});

jest.mock('components/BaseMap/PolygonMap', () => () => {
  return <div />;
});

// MSW
// Establish API mocking before all tests.
beforeAll(() => {
  server.listen({
    onUnhandledRequest(req) {
      console.error(
        'Found an unhandled %s request to %s',
        req.method,
        req.url.href,
      );
    },
  });
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
