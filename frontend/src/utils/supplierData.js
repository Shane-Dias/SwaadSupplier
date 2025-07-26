// src/utils/supplierData.js
export const suppliers = {
  chickpeas: [
    { id: 1, name: 'Fresh Grains Co.', price: 120, unit: 'kg', distance: '2.5 km', rating: 4.5, stock: 500 },
    { id: 2, name: 'Wholesale Pulses', price: 115, unit: 'kg', distance: '5.2 km', rating: 4.2, stock: 800 },
    { id: 3, name: 'Local Market Store', price: 125, unit: 'kg', distance: '1.8 km', rating: 4.0, stock: 200 }
  ],
  flour: [
    { id: 4, name: 'Flour Mills Direct', price: 45, unit: 'kg', distance: '3.1 km', rating: 4.6, stock: 1000 },
    { id: 5, name: 'Bakery Supplies', price: 48, unit: 'kg', distance: '4.5 km', rating: 4.3, stock: 600 },
    { id: 6, name: 'Grain House', price: 42, unit: 'kg', distance: '6.2 km', rating: 4.1, stock: 300 }
  ],
  oil: [
    { id: 7, name: 'Pure Oil Co.', price: 180, unit: 'liter', distance: '2.8 km', rating: 4.4, stock: 150 },
    { id: 8, name: 'Cooking Essentials', price: 175, unit: 'liter', distance: '3.9 km', rating: 4.2, stock: 200 },
    { id: 9, name: 'Local Grocery', price: 185, unit: 'liter', distance: '1.5 km', rating: 3.9, stock: 80 }
  ],
  onions: [
    { id: 10, name: 'Fresh Veggie Hub', price: 35, unit: 'kg', distance: '2.0 km', rating: 4.3, stock: 400 },
    { id: 11, name: 'Vegetable Market', price: 32, unit: 'kg', distance: '4.1 km', rating: 4.1, stock: 600 },
  ],
  tomatoes: [
    { id: 12, name: 'Fresh Veggie Hub', price: 45, unit: 'kg', distance: '2.0 km', rating: 4.3, stock: 300 },
    { id: 13, name: 'Vegetable Market', price: 42, unit: 'kg', distance: '4.1 km', rating: 4.1, stock: 500 },
  ]
};

export function getSuppliersByIngredient(ingredient) {
  return suppliers[ingredient] || [];
}

export function getBestSupplier(ingredient) {
  const ingredientSuppliers = suppliers[ingredient] || [];
  if (ingredientSuppliers.length === 0) return null;
  
  // Sort by price (ascending) and rating (descending)
  return ingredientSuppliers.sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    return b.rating - a.rating;
  })[0];
}
