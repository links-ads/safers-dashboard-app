import * as actionTypes from '../actions/types';
import { updateObject } from './utility';

const initialState = {
  allIngredients: [],
  oldIndex: undefined,
  newIndex: undefined,
  error: false,
  loading: false

};

const ingredientsReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.INGREDIENT_POPULATE_START: return populateIngredientsStart(state, action);
  case actionTypes.INGREDIENT_POPULATE_SUCCESS: return populateIngredientsSuccess(state, action);
  case actionTypes.INGREDIENT_POPULATE_FAIL: return populateIngredientsFail(state, action);
  case actionTypes.INGREDIENT_MOVE_SUCCESS: return moveIngredientsSuccess(state, action);
  case actionTypes.INGREDIENT_ADD_START: return addIngredientsStart(state, action);
  case actionTypes.INGREDIENT_ADD_SUCCESS: return addIngredientsSuccess(state, action);
  case actionTypes.INGREDIENT_ADD_FAIL: return addIngredientsFail(state, action);
  default:
    return state;
  }
};

const addIngredientsStart = (state) => {
  const updatedState = {
    error: false,
    loading: true
  }
  return updateObject(state, updatedState);
}

const addIngredientsSuccess = (state, action) => {
  const updatedState = {
    allIngredients: [action.ingredient, ...state.allIngredients],
    error: false,
    loading: false
  }
  return updateObject(state, updatedState);
}

const addIngredientsFail = (state) => {
  const updatedState = {
    error: true,
    loading: false
  }
  return updateObject(state, updatedState);
}

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