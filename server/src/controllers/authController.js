const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { knex } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'civicfix_secret_jwt_token_key_2026';

async function register(req, res) {
  try {
    const { email, password, full_name, role = 'citizen', department } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [inserted] = await knex('users').insert({
      email,
      password_hash,
      full_name,
      role,
      department: role === 'admin' ? department || 'General Municipal' : null,
    }).returning('*');

    const userId = typeof inserted === 'object' ? inserted.id : inserted;
    const user = typeof inserted === 'object' ? inserted : await knex('users').where({ id: userId }).first();
    if (user && user.password_hash) {
      delete user.password_hash;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userProfile } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
}

async function getMe(req, res) {
  try {
    const user = await knex('users').where({ id: req.user.id }).select('id', 'email', 'full_name', 'role', 'department', 'created_at').first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
}

module.exports = {
  register,
  login,
  getMe,
};
