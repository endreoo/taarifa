import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

// Dummy user for testing
const dummyUser = {
  id: 1,
  email: 'test@test.com',
  password: 'test123',
  fullName: 'Test User',
  memberSince: '2023',
  status: 'Gold Member',
  points: 2500,
  discountLevel: '7%'
};

export const register = async (req: Request, res: Response) => {
  // For demo purposes, just return success
  const token = jwt.sign({ id: dummyUser.id }, JWT_SECRET, { expiresIn: '24h' });
  return res.json({
    token,
    user: {
      id: dummyUser.id,
      email: dummyUser.email,
      fullName: dummyUser.fullName
    }
  });
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check against dummy credentials
  if (email === dummyUser.email && password === dummyUser.password) {
    const token = jwt.sign({ id: dummyUser.id }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({
      token,
      user: {
        id: dummyUser.id,
        email: dummyUser.email,
        fullName: dummyUser.fullName
      }
    });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
};

export const getProfile = async (req: Request, res: Response) => {
  // For demo purposes, return dummy user data
  return res.json({
    id: dummyUser.id,
    email: dummyUser.email,
    fullName: dummyUser.fullName,
    memberSince: dummyUser.memberSince,
    status: dummyUser.status,
    points: dummyUser.points,
    discountLevel: dummyUser.discountLevel
  });
}; 