import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from '../src/config/environment.js';
import { XMLParser } from 'fast-xml-parser';
import { register, signin, getProfile } from './api/auth.js';

// @ts-ignore
import whatsappRoutes from './api/whatsapp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'application/xml' }));

// Add request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes - Keep all API routes before the static file handling
app.post('/api/auth/register', async (req, res) => {
  try {
    await register(req, res);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    await signin(req, res);
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/profile', async (req, res) => {
  try {
    await getProfile(req, res);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/ezee', async (req: Request, res: Response) => {
  try {
    console.log('=== Received eZee API Request ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const ezeeUrl = 'https://live.ipms247.com/pmsinterface/getdataAPI.php';
    const hotelCode = config.ezeeApi.hotelCode;
    const authCode = config.ezeeApi.authCode;

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

    if (response.status === 200) {
      res.send(response.data);
      return;
    }
    
    throw new Error(`eZee API returned status ${response.status}`);
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
      return;
    }
    
    res.status(500).json({
      error: 'Failed to fetch from eZee API',
      message: error.message
    });
  }
});

// API routes
app.use('/api/whatsapp', whatsappRoutes);

// Static file serving - After API routes
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Catch-all route for React app - Must be last
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5170;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
}); 