import { combineReducers } from 'redux';
import todoReducer from './todo';

const appReducer = combineReducers({
  todo: todoReducer,
});

export default appReducer;
