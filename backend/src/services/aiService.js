const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const Product = require('../models/Product');

// Initialize Gemini AI client
let genAI = null;
if (env.geminiApiKey) {
  genAI = new GoogleGenerativeAI(env.geminiApiKey);
}

// Get AI response about products
async function getProductAssistantResponse(userQuestion, productId = null) {
  if (!genAI) {
    throw new Error('AI service is not configured. Please set GEMINI_API_KEY in environment variables.');
  }

  let productContext = '';

  // If product ID is provided, fetch product details for context
  if (productId) {
    const product = await Product.findById(productId);
    if (product) {
      productContext = `
Product Information:
- Name: ${product.name}
- Description: ${product.description}
- Price: $${product.price}
- Category: ${product.category}
- Stock: ${product.stock} units available
`;
    }
  }

  // Create prompt for AI
  const prompt = `You are a helpful product assistant for an e-commerce store. 
${productContext ? productContext : 'You can answer questions about products in general.'}

User Question: ${userQuestion}

Please provide a clear, helpful, and concise answer. If the question is about a specific product, use the product information provided. 
Keep your response friendly and informative, suitable for customers who may not be tech-savvy.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`AI service error: ${error.message}`);
  }
}

module.exports = { getProductAssistantResponse };
