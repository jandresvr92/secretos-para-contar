import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../database/init.js';
import { validateRequest, loginSchema, registerSchema, changePasswordSchema } from '../middleware/validation.js';
import { authenticateToken, getUserFromDatabase } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDatabase();

    // Find user
    db.get(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Error del servidor' });
        }

        if (!user) {
          return res.status(401).json({ 
            error: 'Credenciales inválidas',
            code: 'INVALID_CREDENTIALS'
          });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ 
            error: 'Credenciales inválidas',
            code: 'INVALID_CREDENTIALS'
          });
        }

        // Generate JWT
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email, 
            role: user.role 
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        console.log({token})

        // Update last login
        db.run(
          'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );

        res.json({
          message: 'Inicio de sesión exitoso',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Register
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    const db = getDatabase();

    // Check if user exists
    db.get(
      'SELECT id FROM users WHERE email = ?',
      [email],
      async (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Error del servidor' });
        }

        if (existingUser) {
          return res.status(409).json({ 
            error: 'El usuario ya existe',
            code: 'USER_EXISTS'
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        db.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, role],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Error creando usuario' });
            }

            // Generate JWT
            const token = jwt.sign(
              { 
                id: this.lastID, 
                email, 
                role 
              },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({
              message: 'Usuario registrado exitosamente',
              token,
              user: {
                id: this.lastID,
                name,
                email,
                role
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await getUserFromDatabase(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Change password
router.patch('/password', authenticateToken, validateRequest(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();

    // Get current user
    db.get(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Error del servidor' });
        }

        if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ 
            error: 'Contraseña actual incorrecta',
            code: 'INVALID_CURRENT_PASSWORD'
          });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        db.run(
          'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [hashedNewPassword, req.user.id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Error actualizando contraseña' });
            }

            res.json({ message: 'Contraseña actualizada exitosamente' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await getUserFromDatabase(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Generate new token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Token renovado exitosamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;