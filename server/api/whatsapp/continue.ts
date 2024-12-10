import { Request, Response } from 'express';
import axios from 'axios';

interface ChatMessage {
  sender: 'user' | 'ai';
  content: string;
}

const WAHA_URL = process.env.WAHA_URL || 'http://localhost:3000';

export const continueChat = async (req: Request, res: Response) => {
  const { chatHistory, phoneNumber } = req.body;

  if (!chatHistory || !phoneNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Format chat history for WhatsApp
    const formattedMessage = (chatHistory as ChatMessage[])
      .map(msg => `${msg.sender === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n');

    // Send message via waha API
    await axios.post(`${WAHA_URL}/api/sendText`, {
      phone: phoneNumber,
      text: formattedMessage,
      session: 'default'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('WhatsApp continuation error:', error);
    res.status(500).json({ error: 'Failed to continue chat on WhatsApp' });
  }
}; 