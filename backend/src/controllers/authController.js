const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretcindrokey2026', {
    expiresIn: '30d',
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // For demonstration, if user passwordHash is 'hashed_password_placeholder', we accept any password since seed doesn't hash
    // In production, ALWAYS compare via bcrypt!
    let isMatch = false;
    if (user && user.passwordHash === 'hashed_password_placeholder' && password === 'admin') {
      isMatch = true;
    } else if (user) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (user && isMatch) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  // Token invalidation should be handled on the client by deleting the cookie/local storage
  res.json({ message: 'Logged out successfully' });
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, getMe };
