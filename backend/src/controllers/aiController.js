const { getProductAssistantResponse } = require('../services/aiService');

// Handle AI product assistant queries
async function askQuestion(req, res, next) {
  try {
    const { question, productId } = req.body;
    const response = await getProductAssistantResponse(question, productId);
    res.json({ success: true, response });
  } catch (error) {
    next(error);
  }
}

module.exports = { askQuestion };
