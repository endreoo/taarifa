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

    const response = await axios.post(
      ezeeUrl,
      req.body,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        }
      }
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error('eZee API Error:', error);
    res.status(500).json({ error: 'Failed to fetch from eZee API' });
  }
} 