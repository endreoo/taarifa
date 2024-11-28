import express, { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Add request logging middleware
const requestLogger: RequestHandler = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
};

app.use(requestLogger);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'X-Ezee-Url', 'X-Ezee-Hotel', 'X-Ezee-Auth'],
  exposedHeaders: ['Content-Type', 'Accept']
}));

app.use(bodyParser.text({ type: 'application/xml' }));

// eZee API proxy endpoint
const ezeeHandler: RequestHandler = async (req, res, next) => {
  try {
    console.log('=== Received eZee API Request ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const ezeeUrl = req.get('x-ezee-url');
    const hotelCode = req.get('x-ezee-hotel');
    const authCode = req.get('x-ezee-auth');

    if (!ezeeUrl || !hotelCode || !authCode) {
      res.status(400).json({
        error: 'Missing required headers'
      });
      return;
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
          'Accept': 'application/xml'
        },
        timeout: 10000, // 10 second timeout
        maxRedirects: 5
      }
    );

    console.log('eZee API Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    res.send(response.data);
  } catch (error) {
    next(error);
  }
};

app.post('/api/ezee', ezeeHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('CORS origin:', process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5170');
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('=== eZee API Error ===');
  if (axios.isAxiosError(err)) {
    console.error('Request config:', err.config);
    console.error('Response:', err.response?.data);
    console.error('Status:', err.response?.status);
    console.error('Headers:', err.response?.headers);
  }
  console.error('Full error:', err);
  
  res.status(500).json({ 
    error: 'Failed to fetch from eZee API',
    details: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined
  });
};

app.use(errorHandler); 