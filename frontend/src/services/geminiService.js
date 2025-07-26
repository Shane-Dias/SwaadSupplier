import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // Vite uses import.meta.env instead of process.env
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
    
    console.log('✅ Gemini API key loaded successfully');
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async calculateIngredients(dishName, quantity) {
    try {
      const prompt = `
        You are an expert Indian street food chef and ingredient calculator. 
        
        Calculate the exact raw materials needed for making ${quantity} plates of ${dishName}.
        
        IMPORTANT: Respond with ONLY a valid JSON object, no markdown formatting, no code blocks, no additional text.
        
        JSON structure:
        {
          "dish": "${dishName}",
          "quantity": ${quantity},
          "ingredients": {
            "ingredient_name": {
              "quantityPerPlate": number,
              "totalQuantity": number,
              "unit": "g" or "ml",
              "category": "vegetable" | "spice" | "oil" | "grain" | "dairy" | "protein"
            }
          },
          "estimatedCost": number,
          "preparationTime": number,
          "difficultyLevel": "easy" | "medium" | "hard"
        }

        Guidelines:
        - Be very precise with quantities based on authentic recipes
        - Include ALL ingredients needed (main ingredients, spices, oils, garnishes)
        - Use grams (g) for solid ingredients and milliliters (ml) for liquids
        - Consider standard Indian street food portion sizes
        - Include realistic market prices for cost estimation
        - Account for wastage (add 5-10% extra to quantities)
        
        Respond with ONLY the JSON object, nothing else.
      `;

      console.log('🤖 Calling Gemini AI for ingredient calculation...');
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      let text = response.text();
      
      console.log('📝 Raw Gemini response:', text);
      
      // Clean the response - remove markdown formatting
      text = this.cleanJSONResponse(text);
      
      console.log('🧹 Cleaned response:', text);
      
      // Parse the JSON response
      const ingredientsData = JSON.parse(text);
      
      console.log('✅ Successfully parsed Gemini response');
      
      return {
        success: true,
        data: ingredientsData
      };
      
    } catch (error) {
      console.error('❌ Error calculating ingredients with Gemini:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackIngredients(dishName, quantity)
      };
    }
  }

  // Clean JSON response method - removes markdown formatting
  cleanJSONResponse(text) {
    try {
      // Remove markdown code blocks
      text = text.replace(/```json/g, '');
      text = text.replace(/```/g, '');
      
      // Remove any leading/trailing whitespace
      text = text.trim();
      
      // Find the first { and last } to extract just the JSON part
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        text = text.substring(firstBrace, lastBrace + 1);
      }
      
      // Test if it's valid JSON
      JSON.parse(text);
      
      return text;
    } catch (error) {
      console.error('❌ Failed to clean JSON response:', error);
      throw new Error('Invalid JSON response from AI');
    }
  }

  // Fallback function in case Gemini fails
  getFallbackIngredients(dishName, quantity) {
    console.log('⚠️ Using fallback ingredients calculation');
    
    const fallbackRecipes = {
      'chole bhature': {
        'chickpeas': { quantityPerPlate: 80, totalQuantity: 80 * quantity, unit: 'g', category: 'protein' },
        'wheat flour': { quantityPerPlate: 60, totalQuantity: 60 * quantity, unit: 'g', category: 'grain' },
        'onion': { quantityPerPlate: 30, totalQuantity: 30 * quantity, unit: 'g', category: 'vegetable' },
        'tomato': { quantityPerPlate: 40, totalQuantity: 40 * quantity, unit: 'g', category: 'vegetable' },
        'ginger-garlic paste': { quantityPerPlate: 5, totalQuantity: 5 * quantity, unit: 'g', category: 'condiment' },
        'cooking oil': { quantityPerPlate: 15, totalQuantity: 15 * quantity, unit: 'ml', category: 'oil' },
        'spices mix': { quantityPerPlate: 8, totalQuantity: 8 * quantity, unit: 'g', category: 'spice' }
      },
      'pav bhaji': {
        'mixed vegetables': { quantityPerPlate: 120, totalQuantity: 120 * quantity, unit: 'g', category: 'vegetable' },
        'pav bread': { quantityPerPlate: 2, totalQuantity: 2 * quantity, unit: 'pieces', category: 'grain' },
        'onion': { quantityPerPlate: 40, totalQuantity: 40 * quantity, unit: 'g', category: 'vegetable' },
        'tomato': { quantityPerPlate: 50, totalQuantity: 50 * quantity, unit: 'g', category: 'vegetable' },
        'butter': { quantityPerPlate: 20, totalQuantity: 20 * quantity, unit: 'g', category: 'dairy' },
        'pav bhaji masala': { quantityPerPlate: 10, totalQuantity: 10 * quantity, unit: 'g', category: 'spice' }
      }
    };

    return fallbackRecipes[dishName.toLowerCase()] || {};
  }
}

export default new GeminiService();
