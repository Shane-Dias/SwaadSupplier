// src/utils/supplierData.js

// Mock database of suppliers
const knownSuppliers = {
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

// Helper to generate consistent pseudo-random numbers from string
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate realistic price based on ingredient name
const generateBasePrice = (ingredient) => {
  const hash = hashString(ingredient.toLowerCase());

  // Categorize for better pricing
  const lower = ingredient.toLowerCase();

  if (lower.includes('saffron') || lower.includes('cardamom') || lower.includes('vanilla')) return 2000 + (hash % 500); // Expensive spices
  if (lower.includes('cashew') || lower.includes('almond') || lower.includes('pistachio')) return 800 + (hash % 200); // Nuts
  if (lower.includes('cheese') || lower.includes('butter') || lower.includes('paneer')) return 400 + (hash % 100); // Dairy
  if (lower.includes('oil') || lower.includes('ghee')) return 150 + (hash % 50); // Oils
  if (lower.includes('chicken') || lower.includes('mutton') || lower.includes('fish')) return 250 + (hash % 150); // Meat
  if (lower.includes('rice') || lower.includes('dal') || lower.includes('pulse')) return 80 + (hash % 40); // Grains
  if (lower.includes('spice') || lower.includes('powder') || lower.includes('masala')) return 300 + (hash % 100); // Spices
  if (lower.includes('potato') || lower.includes('onion') || lower.includes('tomato')) return 30 + (hash % 20); // Basic Veg

  // Default fallback varied by name
  return 40 + (hash % 100);
};

export function getSuppliersByIngredient(ingredient) {
  const normalizedKey = ingredient.toLowerCase();

  // Return known suppliers if they exist
  if (knownSuppliers[normalizedKey]) {
    return knownSuppliers[normalizedKey];
  }

  // Otherwise generate dynamic suppliers
  const basePrice = generateBasePrice(ingredient);
  const hash = hashString(ingredient);

  const unit = (['oil', 'milk', 'water', 'cream', 'sauce', 'vinegar'].some(liquid => normalizedKey.includes(liquid))) ? 'liter' : 'kg';

  return [
    {
      id: hash + 1,
      name: `${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)} Wholesalers`,
      price: basePrice,
      unit: unit,
      distance: `${(hash % 10) / 10 + 1}.5 km`,
      rating: 4.0 + ((hash % 10) / 10),
      stock: 100 + (hash % 500)
    },
    {
      id: hash + 2,
      name: 'City Market Fresh',
      price: Math.max(10, Math.round(basePrice * 0.95)), // 5% cheaper
      unit: unit,
      distance: `${(hash % 10) / 10 + 3}.2 km`,
      rating: 3.8 + ((hash % 10) / 10),
      stock: 50 + (hash % 300)
    },
    {
      id: hash + 3,
      name: 'Premium Supplies Co.',
      price: Math.round(basePrice * 1.15), // 15% more expensive
      unit: unit,
      distance: `${(hash % 10) / 10 + 0}.8 km`,
      rating: 4.8,
      stock: 200 + (hash % 400)
    }
  ];
}

export function getBestSupplier(ingredient) {
  const suppliers = getSuppliersByIngredient(ingredient);
  if (suppliers.length === 0) return null;

  // Sort by price (ascending) and rating (descending)
  return suppliers.sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    return b.rating - a.rating;
  })[0];
}
