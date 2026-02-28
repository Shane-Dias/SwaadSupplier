// src/utils/recipeLogic.js
import geminiService from '../services/geminiService';

// Keep existing available recipes for the dropdown
export const getAvailableRecipes = () => {
  return [
    'chole bhature',
    'pav bhaji',
    'samosa',
    'dosa',
    'biryani',
    'dal makhani',
    'paneer tikka',
    'rajma chawal',
    'aloo paratha',
    'chaat',
    'butter chicken',
    'masala dosa',
    'idli sambhar',
    'vada pav',
    'dhokla',
    'poha',
    'upma',
    'paratha',
    'kulcha',
    'naan'
  ];
};

// Legacy static recipes for fallback (your original data structure)
export const recipes = {
  'chole bhature': {
    chickpeas: { quantityPerPlate: 100, unit: 'g' },
    flour: { quantityPerPlate: 120, unit: 'g' },
    oil: { quantityPerPlate: 20, unit: 'ml' },
    onions: { quantityPerPlate: 50, unit: 'g' },
    tomatoes: { quantityPerPlate: 30, unit: 'g' },
    spices: { quantityPerPlate: 5, unit: 'g' },
  },
  'pav bhaji': {
    potatoes: { quantityPerPlate: 150, unit: 'g' },
    tomatoes: { quantityPerPlate: 80, unit: 'g' },
    onions: { quantityPerPlate: 60, unit: 'g' },
    butter: { quantityPerPlate: 15, unit: 'g' },
    pavbuns: { quantityPerPlate: 2, unit: 'pieces' },
    oil: { quantityPerPlate: 10, unit: 'ml' },
  },
  'samosa': {
    flour: { quantityPerPlate: 50, unit: 'g' },
    potatoes: { quantityPerPlate: 80, unit: 'g' },
    oil: { quantityPerPlate: 100, unit: 'ml' },
    spices: { quantityPerPlate: 3, unit: 'g' },
  }
};

// Enhanced function with Gemini integration (now async)
export const calculateIngredients = async (dish, quantity) => {
  try {
    console.log(`🔄 Calculating ingredients for ${quantity} plates of ${dish}...`);

    // Input validation
    if (!dish || quantity <= 0) {
      return { error: 'Invalid dish name or quantity' };
    }

    if (quantity > 1000) {
      return { error: 'Quantity too large. Maximum 1000 plates allowed.' };
    }

    // Call Gemini service to calculate ingredients
    const result = await geminiService.calculateIngredients(dish, quantity);

    if (result.success && result.data && result.data.ingredients) {
      console.log('✅ Successfully calculated ingredients using Gemini AI');

      // Transform Gemini response to match expected format
      const transformedIngredients = {};

      Object.entries(result.data.ingredients).forEach(([ingredient, details]) => {
        transformedIngredients[ingredient] = {
          quantityPerPlate: details.quantityPerPlate,
          totalQuantity: details.totalQuantity,
          unit: details.unit,
          category: details.category || 'other'
        };
      });

      // Add metadata
      return {
        ...transformedIngredients,
        _metadata: {
          source: 'gemini-ai',
          estimatedCost: result.data.estimatedCost || 0,
          typicalSellingPrice: result.data.typicalSellingPrice || 0,
          preparationTime: result.data.preparationTime || 60,
          difficultyLevel: result.data.difficultyLevel || 'medium',
          calculatedAt: new Date().toISOString()
        }
      };
    } else {
      // Use fallback if Gemini fails
      console.warn('⚠️ Gemini AI failed, using fallback calculation:', result.error);
      return calculateIngredientsStatic(dish, quantity);
    }
  } catch (error) {
    console.error('❌ Error in calculateIngredients:', error);

    // Fallback to static calculation
    console.log('🔄 Falling back to static calculation...');
    return calculateIngredientsStatic(dish, quantity);
  }
};

// Static calculation function (fallback)
function calculateIngredientsStatic(dish, quantity) {
  const recipe = recipes[dish.toLowerCase()];

  if (!recipe) {
    // Generic fallback for unknown dishes
    return {
      'main ingredient': {
        quantityPerPlate: 100,
        totalQuantity: 100 * quantity,
        unit: 'g'
      },
      'spices': {
        quantityPerPlate: 10,
        totalQuantity: 10 * quantity,
        unit: 'g'
      },
      'oil': {
        quantityPerPlate: 15,
        totalQuantity: 15 * quantity,
        unit: 'ml'
      },
      _metadata: {
        source: 'generic-fallback',
        estimatedCost: quantity * 50,
        preparationTime: 45,
        difficultyLevel: 'medium',
        calculatedAt: new Date().toISOString()
      }
    };
  }

  const result = {};

  Object.entries(recipe).forEach(([ingredient, details]) => {
    result[ingredient] = {
      quantityPerPlate: details.quantityPerPlate,
      totalQuantity: details.quantityPerPlate * quantity,
      unit: details.unit
    };
  });

  // Add metadata for static calculations
  result._metadata = {
    source: 'static-recipe',
    estimatedCost: calculateEstimatedCost(result),
    preparationTime: getEstimatedTime(dish),
    difficultyLevel: getDifficultyLevel(dish),
    calculatedAt: new Date().toISOString()
  };

  console.log('✅ Used static recipe calculation');
  return result;
}

// Helper function to format ingredients for display
export const formatIngredientsForDisplay = (ingredients) => {
  // Filter out metadata
  const ingredientEntries = Object.entries(ingredients).filter(([key]) => !key.startsWith('_'));

  return ingredientEntries.map(([name, details]) => ({
    name,
    displayName: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
    quantity: details.totalQuantity,
    unit: details.unit,
    perPlate: details.quantityPerPlate,
    category: details.category || 'other'
  }));
};

// Helper function to calculate total cost with supplier data
export const calculateTotalCost = (ingredients, suppliersData = {}, selectedSuppliers = {}) => {
  let total = 0;

  Object.entries(ingredients).forEach(([ingredient, details]) => {
    if (ingredient.startsWith('_')) return; // Skip metadata

    const supplierId = selectedSuppliers[ingredient];
    if (supplierId && suppliersData[ingredient]) {
      const suppliers = suppliersData[ingredient];
      const supplier = suppliers.find(s => s.id === supplierId);

      if (supplier) {
        // Convert to standard units (kg/L) for pricing
        const requiredKg = details.totalQuantity / 1000;
        const requiredLiters = details.unit === 'ml' ? details.totalQuantity / 1000 : 0;
        const requiredQuantity = details.unit === 'ml' ? requiredLiters : requiredKg;
        total += requiredQuantity * supplier.price;
      }
    } else {
      // Use default pricing if no supplier selected
      const pricePerUnit = getDefaultPrice(ingredient, details.unit);
      const quantity = details.unit === 'ml' ? details.totalQuantity / 1000 : details.totalQuantity / 1000;
      total += quantity * pricePerUnit;
    }
  });

  return Math.ceil(total);
};

// Default price estimation (per kg or liter)
const getDefaultPrice = (ingredient, unit) => {
  const defaultPrices = {
    // Vegetables (per kg)
    'onion': 30, 'onions': 30,
    'tomato': 40, 'tomatoes': 40,
    'potato': 25, 'potatoes': 25,
    'ginger': 200,
    'garlic': 180,
    'capsicum': 60,
    'carrot': 40,
    'cauliflower': 35,

    // Spices (per kg)
    'turmeric': 300,
    'chili powder': 400,
    'coriander powder': 250,
    'cumin powder': 300,
    'garam masala': 800,
    'spices': 400,

    // Oils and fats (per liter/kg)
    'cooking oil': 120, 'oil': 120,
    'ghee': 500,
    'butter': 400,

    // Grains and flours (per kg)
    'rice': 60,
    'wheat flour': 35, 'flour': 35,
    'chickpeas': 80,
    'lentils': 90,
    'dal': 90,

    // Dairy (per liter for liquids, per kg for solids)
    'milk': 55,
    'paneer': 300,
    'yogurt': 60, 'curd': 60,

    // Proteins (per kg)
    'chicken': 200,
    'mutton': 500,
    'fish': 300,
    'eggs': 6, // per piece

    // Miscellaneous
    'sugar': 45,
    'salt': 20,
    'bread': 5, // per piece
    'pavbuns': 3, // per piece
  };

  const basePrice = defaultPrices[ingredient.toLowerCase()] || 100;

  // Adjust for unit type
  if (unit === 'pieces') {
    return basePrice; // Price per piece
  }

  return basePrice; // Default fallback price per kg/L
};

// Helper function to estimate preparation time
const getEstimatedTime = (dish) => {
  const timings = {
    'chole bhature': 90,
    'pav bhaji': 45,
    'samosa': 60,
    'dosa': 30,
    'biryani': 120,
    'dal makhani': 75,
    'paneer tikka': 40,
    'rajma chawal': 90,
    'aloo paratha': 30,
    'chaat': 20
  };

  return timings[dish.toLowerCase()] || 60;
};

// Helper function to estimate difficulty level
const getDifficultyLevel = (dish) => {
  const difficulties = {
    'chole bhature': 'hard',
    'pav bhaji': 'medium',
    'samosa': 'medium',
    'dosa': 'medium',
    'biryani': 'hard',
    'dal makhani': 'medium',
    'paneer tikka': 'easy',
    'rajma chawal': 'medium',
    'aloo paratha': 'easy',
    'chaat': 'easy'
  };

  return difficulties[dish.toLowerCase()] || 'medium';
};

// Helper function to estimate cost for static recipes
const calculateEstimatedCost = (ingredients) => {
  let total = 0;

  Object.entries(ingredients).forEach(([ingredient, details]) => {
    if (ingredient.startsWith('_')) return; // Skip metadata

    const pricePerUnit = getDefaultPrice(ingredient, details.unit);
    const quantity = details.unit === 'ml' ? details.totalQuantity / 1000 : details.totalQuantity / 1000;
    total += quantity * pricePerUnit;
  });

  return Math.ceil(total);
};

// Validation helper for ingredient data
export const validateIngredients = (ingredients) => {
  const errors = [];
  const warnings = [];

  if (!ingredients || typeof ingredients !== 'object') {
    errors.push('Invalid ingredients data');
    return { isValid: false, errors, warnings };
  }

  const ingredientEntries = Object.entries(ingredients).filter(([key]) => !key.startsWith('_'));

  if (ingredientEntries.length === 0) {
    errors.push('No ingredients found');
    return { isValid: false, errors, warnings };
  }

  ingredientEntries.forEach(([name, details]) => {
    if (!details.quantityPerPlate || !details.totalQuantity || !details.unit) {
      errors.push(`Missing required fields for ingredient: ${name}`);
    }

    if (details.totalQuantity <= 0) {
      errors.push(`Invalid quantity for ingredient: ${name}`);
    }

    if (!['g', 'ml', 'kg', 'L', 'pieces'].includes(details.unit)) {
      warnings.push(`Unusual unit '${details.unit}' for ingredient: ${name}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Export legacy function for backward compatibility
export function calculateIngredientsSync(dish, quantity) {
  console.warn('⚠️ Using deprecated synchronous calculateIngredients. Please use async version.');
  return calculateIngredientsStatic(dish, quantity);
}

// Utility to get ingredient categories
export const getIngredientCategories = () => {
  return [
    'vegetable',
    'spice',
    'oil',
    'grain',
    'dairy',
    'protein',
    'condiment',
    'herb',
    'other'
  ];
};

// Export metadata helpers
export const getCalculationMetadata = (ingredients) => {
  return ingredients._metadata || {
    source: 'unknown',
    calculatedAt: new Date().toISOString()
  };
};

export const isAICalculated = (ingredients) => {
  const metadata = getCalculationMetadata(ingredients);
  return metadata.source === 'gemini-ai';
};

export const isStaticCalculated = (ingredients) => {
  const metadata = getCalculationMetadata(ingredients);
  return metadata.source === 'static-recipe';
};
