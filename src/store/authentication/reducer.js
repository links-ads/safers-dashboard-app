import * as actionTypes from './types';
import { updateObject } from '../utility';

const initialState = {
  allIngredients: [],
  oldIndex: undefined,
  newIndex: undefined,
  error: false,
  loading: false

};

const ingredientsReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.SIGN_IN_SUCCESS: return populateIngredientsStart(state, action);
  case actionTypes.SIGN_IN_FAIL: return populateIngredientsSuccess(state, action);
  case actionTypes.SIGN_UP_SUCCESS: return populateIngredientsFail(state, action);
  case actionTypes.SIGN_UP_FAIL: return moveIngredientsSuccess(state, action);
  default:
    return state;
  }
};

const moveIngredientsSuccess = (state) => {
  const updatedState = {
    oldIndex: undefined,
    newIndex: undefined,
    error: false,
    loading: false
  }
  return updateObject(state, updatedState);
}


const populateIngredientsStart = (state) => {
  const updatedState = {
    allIngredients: [],
    error: false,
    loading: true
  }
  return updateObject(state, updatedState);
}

const populateIngredientsSuccess = (state, action) => {
  const updatedState = {
    allIngredients: action.ingredients,
    error: false
  }
  return updateObject(state, updatedState);
}

const populateIngredientsFail = (state) => {
  return updateObject(state, { error: true });
};

export default ingredientsReducer;