import { Request, Response } from 'express';
import axios from 'axios';

const AI_CHAT_SERVICE_URL = process.env.AI_CHAT_SERVICE_URL || 'http://localhost:4000';

export const handleChat = async (req: Request, res: Response) => {
  const { message, history, rewardProgramId, siteId } = req.body;

  try {
    const response = await axios.post(`${AI_CHAT_SERVICE_URL}/api/chat`, {
      message,
      history,
      metadata: {
        siteId,
        rewardProgramId,
        source: 'web_chat',
        url: req.headers.origin
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Chat Service error:', error);
    res.status(500).json({ 
      error: 'Failed to get response',
      message: 'I apologize, but I am having trouble connecting to the service. Please try again in a moment.'
    });
  }
}; 