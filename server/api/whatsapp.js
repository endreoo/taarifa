import { Router } from 'express';
import axios from 'axios';

const WHATSAPP_API = 'https://wa.hotelonline.co/api';
const router = Router();

/** @type {import('express').RequestHandler} */
const sendHandler = async (req, res) => {
  try {
    const { phone, text } = req.body;

    if (!phone || !text) {
      res.status(400).json({ 
        success: false, 
        message: 'Phone number and text are required' 
      });
      return;
    }

    try {
      // Format recipient's phone number
      const chatId = `${phone.replace(/\D/g, '').replace(/^0/, '254')}@c.us`;
      
      const response = await axios({
        method: 'post',
        url: `${WHATSAPP_API}/sendText`,
        data: {
          session: 'default',
          chatId: chatId,
          text: text
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      console.log('WhatsApp API response:', {
        status: response.status,
        data: response.data
      });

      if (response.status === 200 || response.status === 201) {
        res.json({ 
          success: true, 
          message: 'Message sent successfully',
          data: response.data 
        });
      } else {
        throw new Error(`WhatsApp API returned status ${response.status}`);
      }
    } catch (apiError) {
      console.error('WhatsApp API error:', {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status
      });

      res.status(500).json({
        success: false,
        message: 'Failed to send WhatsApp message. Please try again later.',
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('WhatsApp handler error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while processing WhatsApp request' 
    });
  }
};

router.post('/send', sendHandler);

export { router as default }; 