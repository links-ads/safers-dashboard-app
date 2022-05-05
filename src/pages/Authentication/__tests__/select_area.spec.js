/* eslint-disable init-declarations */
/* eslint-disable no-unused-vars */
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

import SignIn from '../SignIn';
import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../store'
import axiosMock from '../../../../__mocks__/axios';
import { baseURL, mockedHref, mockedNavigator } from '../../../TestUtils';
import { endpoints } from '../../../api/endpoints';
import SelectArea from '../SelectArea';
import { AOIS } from '../../../../__mocks__/aoi';
import {createMemoryHistory} from 'history';
import { signIn } from '../../../store/appAction';
import { USERS } from '../../../../__mocks__/auth';
import userEvent from '@testing-library/user-event';
import { signInSuccess } from '../../../store/authentication/action';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Select Area Component', () => {
  let mock;
  const history = createMemoryHistory();
  const request = {
    username : 'mmb.221177@gmail.com',
    password : '1234', 
    rememberMe : false};
  
  beforeAll(() => {
    mock = axiosMock;
    mock.onGet(`${baseURL}${endpoints.aoi.getAll}`).reply(200, AOIS);
  })
  beforeEach(() => {
    renderApp(store);
    
  })
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  function renderApp(props = {}) {
    return render(
      <Provider store={store}>
        <BrowserRouter history={history}>
          <SelectArea {...props} />
        </BrowserRouter>
      </Provider>,
    );
  }
  describe('redirect to sign in if not logged in', () => {
    beforeEach(() => {
      renderApp(store);
    })
    it('should  navigate to a sign in page', () => {
     
      expect(mockedNavigate).toHaveBeenCalledWith('/auth/sign-in');
    });
  });
  describe('Test Select Aoi Component', () => {
    mock = axiosMock;
    const uid = USERS.user.id
    const endpointSetDefaultAoi = endpoints.user.profile + uid;
    
    mock.onPatch(`${baseURL}${endpointSetDefaultAoi}`).reply(() => {
      return [200, USERS]
    });

    beforeAll(() => {
      act(() => {
        store.dispatch(signInSuccess(USERS.user))
      })
    })
    
    it('check if page is displaying', () => {
      expect(screen.getByText(/Choose your area of interest/i)).toBeInTheDocument()
    })
    it('updates selected area of in interest in the store', async() => {
      act(() => {
        const radioInputs = screen.getAllByRole('radio');
        fireEvent.click(radioInputs[0])
        
      })
      act(() => {
        fireEvent.click(screen.getByRole('button', {name :'SAVE AREA OF INTEREST'}))
      })
      await waitFor(() => {
        expect(store.getState().user.aoiSetSuccess).not.toEqual(null)
      })
      //calls dashboard
      
      await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
      })
        
      
    })
  })  
  
})
