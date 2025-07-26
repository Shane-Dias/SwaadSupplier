// src/utils/recipeLogic.js
export const recipes = {
  'chole bhature': {
    chickpeas: 100,        // grams per plate
    flour: 120,            // grams per plate
    oil: 20,               // ml per plate
    onions: 50,            // grams per plate
    tomatoes: 30,          // grams per plate
    spices: 5,             // grams per plate
  },
  'pav bhaji': {
    potatoes: 150,         // grams per plate
    tomatoes: 80,          // grams per plate
    onions: 60,            // grams per plate
    butter: 15,            // grams per plate
    pavbuns: 2,            // pieces per plate
    oil: 10,               // ml per plate
  },
  'samosa': {
    flour: 50,             // grams per piece
    potatoes: 80,          // grams per piece
    oil: 100,              // ml per piece (for frying)
    spices: 3,             // grams per piece
  }
};

export function calculateIngredients(dish, quantity) {
  const recipe = recipes[dish.toLowerCase()];
  if (!recipe) {
    return { error: `Recipe for "${dish}" not found` };
  }
  
  const result = {};
  Object.entries(recipe).forEach(([ingredient, qtyPerUnit]) => {
    result[ingredient] = {
      totalQuantity: qtyPerUnit * quantity,
      unit: getUnit(ingredient),
      perUnit: qtyPerUnit
    };
  });
  
  return result;
}

function getUnit(ingredient) {
  const liquidIngredients = ['oil', 'milk', 'water'];
  if (liquidIngredients.includes(ingredient)) {
    return 'ml';
  }
  return 'grams';
}

export function getAvailableRecipes() {
  return Object.keys(recipes);
}
