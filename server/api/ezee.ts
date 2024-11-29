import axios from 'axios';
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const ezeeUrl = req.headers['x-ezee-url'] as string | undefined;
    const hotelCode = req.headers['x-ezee-hotel'] as string | undefined;
    const authCode = req.headers['x-ezee-auth'] as string | undefined;

    if (!ezeeUrl || !hotelCode || !authCode) {
      return res.status(400).json({ 
        error: 'Missing required headers',
        details: {
          ezeeUrl: !ezeeUrl,
          hotelCode: !hotelCode,
          authCode: !authCode
        }
      });
    }

    console.log('Making eZee API call:', {
      url: ezeeUrl,
      hotelCode,
      body: req.body
    });

    const response = await axios.post(
      ezeeUrl,
      req.body,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'Authorization': `Basic ${Buffer.from(`${hotelCode}:${authCode}`).toString('base64')}`
        },
        timeout: 60000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      }
    );

    console.log('eZee API Response:', {
      status: response.status,
      data: response.data
    });

    if (response.status === 200) {
      res.status(200).send(response.data);
    } else {
      throw new Error(`eZee API returned status ${response.status}`);
    }
  } catch (error: any) {
    console.error('eZee API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.status === 502) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: 'The eZee API is temporarily unavailable. Please try again later.'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch from eZee API',
        message: error.message
      });
    }
  }
} 