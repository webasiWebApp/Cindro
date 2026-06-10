const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// AUTH DISABLED FOR DEVELOPMENT — set AUTH_DISABLED=true in .env to bypass login
const AUTH_DISABLED = process.env.AUTH_DISABLED === 'true';

let devUserId = null;

const getOrCreateDevUser = async () => {
  if (devUserId) return devUserId;

  // Try to find an existing user first
  let user = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });

  if (!user) {
    // Create a dev user if none exist
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    user = await prisma.user.create({
      data: {
        name: 'Dev Admin',
        email: 'admin@cindro.com',
        passwordHash: hash,
        role: 'ADMIN',
      },
    });
    console.log('✅ Created dev user:', user.email);
  }

  devUserId = user.id;
  return devUserId;
};

const protect = async (req, res, next) => {
  // If auth is disabled, inject a real user from the database
  if (AUTH_DISABLED) {
    try {
      const id = await getOrCreateDevUser();
      req.user = { id, role: 'ADMIN' };
      return next();
    } catch (err) {
      console.error('Failed to get/create dev user:', err);
      return res.status(500).json({ error: 'Auth bypass failed' });
    }
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretcindrokey2026');
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
