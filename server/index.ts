import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import { config } from '../src/config/environment.js';
import { XMLParser } from 'fast-xml-parser';

const app = express();

app.use(cors());
app.use(bodyParser.text({ type: 'application/xml' }));

// Add request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.post('/api/ezee', async (req: Request, res: Response) => {
  try {
    console.log('=== Received eZee API Request ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const ezeeUrl = 'https://live.ipms247.com/pmsinterface/getdataAPI.php';
    const hotelCode = config.ezeeApi.hotelCode;
    const authCode = config.ezeeApi.authCode;

    console.log('Making eZee API call:', {
      url: ezeeUrl,
      hotelCode,
      authCode,
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
      headers: response.headers,
      data: response.data
    });

    if (response.data && response.data.includes('ErrorCode')) {
      const parser = new XMLParser();
      const result = parser.parse(response.data);
      if (result.Errors) {
        console.error('eZee API Error:', result.Errors);
        res.status(400).json({
          error: 'eZee API Error',
          code: result.Errors.ErrorCode,
          message: result.Errors.ErrorMessage
        });
        return;
      }
    }

    if (response.status === 200) {
      res.send(response.data);
    } else {
      throw new Error(`eZee API returned status ${response.status}`);
    }
  } catch (error: any) {
    console.error('eZee API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
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
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV
  });
});

const PORT = process.env.PORT || 5170;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('eZee API Config:', {
    hotelCode: config.ezeeApi.hotelCode,
    authCode: config.ezeeApi.authCode
  });
}); 