const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const Product = require('../models/Product');

const geminiClient = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;

async function askChatGpt(prompt) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: env.chatGptModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300
    },
    {
      headers: {
        Authorization: `Bearer ${env.chatGptApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  const answer = response.data.choices?.[0]?.message?.content || 'No response';
  return answer.trim();
}

async function askAi(prompt) {
  const cleanPrompt = prompt.trim();

  if (geminiClient) {
    try {
      const model = geminiClient.getGenerativeModel({ model: env.geminiModel });
      const result = await model.generateContent(cleanPrompt);
      const text = result.response?.text?.() || 'No response';
      return text.trim();
    } catch (error) {
      if (env.chatGptApiKey) {
        return askChatGpt(cleanPrompt);
      }
      throw error;
    }
  }

  if (env.chatGptApiKey) {
    return askChatGpt(cleanPrompt);
  }

  return 'Demo response: add GEMINI_API_KEY or CHATGPT_API_KEY in backend/.env to get live AI answers.';
}

// Get AI response about products
async function getProductAssistantResponse(userQuestion, productId = null) {
  let productContext = '';

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

  const prompt = `You are a helpful product assistant for an e-commerce store.
${productContext ? productContext : 'You can answer questions about products in general.'}

User Question: ${userQuestion}

Please provide a clear, helpful, and concise answer. If the question is about a specific product, use the product information provided.
Keep your response friendly and informative, suitable for customers who may not be tech-savvy.`;

  try {
    return await askAi(prompt);
  } catch (error) {
    throw new Error(`AI service error: ${error.message}`);
  }
}

module.exports = { getProductAssistantResponse };
