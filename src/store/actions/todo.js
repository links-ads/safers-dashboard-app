import * as actionTypes from './types';

export const populateIngredients = () => {
  return {
    type: actionTypes.INGREDIENT_POPULATE
  };
};
export const populateIngredientsStart = () => {
  return {
    type: actionTypes.INGREDIENT_POPULATE_START
  };
};
export const populateIngredientsSuccess = (res) => {
  return {
    type: actionTypes.INGREDIENT_POPULATE_SUCCESS,
    ingredients: res
  }
}
export const populateIngredientsFail = () => {
  return {
    type: actionTypes.INGREDIENT_POPULATE_FAIL,
  }
}

export const addIngredient = (name) => {
  return {
    type: actionTypes.INGREDIENT_ADD,
    ingredientName: name
  };
};
export const addIngredientStart = (ingredient) => {
  return {
    type: actionTypes.INGREDIENT_ADD_START,
    ingredient
  };
};
export const addIngredientSuccess = (ingredient) => {
  return {
    type: actionTypes.INGREDIENT_ADD_SUCCESS,
    ingredient
  }
}
export const addIngredientFail = () => {
  return {
    type: actionTypes.INGREDIENT_ADD_FAIL,
  }
}

export const moveIngredients = (oldIndex, newIndex) => {
  return {
    type: actionTypes.INGREDIENT_MOVE,
    from: oldIndex,
    to: newIndex
  }
}
export const moveIngredientsStart = (oldIndex, newIndex) => {
  return {
    type: actionTypes.INGREDIENT_MOVE_START,
    from: oldIndex,
    to: newIndex
  }
}
export const moveIngredientsSuccess = () => {
  return {
    type: actionTypes.INGREDIENT_MOVE_SUCCESS,
  }
}
export const moveIngredientsFail = () => {
  return {
    type: actionTypes.INGREDIENT_MOVE_FAIL,
  }
}

