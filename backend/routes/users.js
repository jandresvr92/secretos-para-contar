import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest, updateUserSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const db = getDatabase();
    const { role, search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    db.all(query, params, (err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Error obteniendo usuarios' });
      }
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
      const countParams = [];
      
      if (role) {
        countQuery += ' AND role = ?';
        countParams.push(role);
      }
      
      if (search) {
        countQuery += ' AND (name LIKE ? OR email LIKE ?)';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm);
      }
      
      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          console.error('Error counting users:', err);
          return res.status(500).json({ error: 'Error contando usuarios' });
        }
        
        res.json({
          users,
          pagination: {
            total: countResult.total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parseInt(limit) < countResult.total
          }
        });
      });
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get single user (admin only)
router.get('/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.params.id;
    
    db.get(`
      SELECT id, name, email, role, is_active, created_at, updated_at 
      FROM users 
      WHERE id = ?
    `, [userId], (err, user) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ error: 'Error obteniendo usuario' });
      }
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }
      
      res.json({ user });
    });
  } catch (error) {
    console.error('User detail error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), validateRequest(updateUserSchema), (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.params.id;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = Object.keys(updates).filter(key => updates[key] !== undefined);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    
    values.push(userId);
    
    db.run(`
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, values, function(err) {
      if (err) {
        console.error('Error updating user:', err);
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(409).json({ 
            error: 'El email ya está en uso',
            code: 'EMAIL_EXISTS'
          });
        }
        return res.status(500).json({ error: 'Error actualizando usuario' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Get updated user
      db.get(`
        SELECT id, name, email, role, is_active, created_at, updated_at 
        FROM users 
        WHERE id = ?
      `, [userId], (err, user) => {
        if (err) {
          console.error('Error fetching updated user:', err);
          return res.status(500).json({ error: 'Error obteniendo usuario actualizado' });
        }
        
        res.json({
          message: 'Usuario actualizado exitosamente',
          user
        });
      });
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Change user password (admin only)
router.patch('/:id/password', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres',
        code: 'INVALID_PASSWORD'
      });
    }
    
    const db = getDatabase();
    const userId = req.params.id;
    
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Error procesando contraseña' });
      }
      
      db.run(`
        UPDATE users 
        SET password = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [hashedPassword, userId], function(err) {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ error: 'Error actualizando contraseña' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ 
            error: 'Usuario no encontrado',
            code: 'USER_NOT_FOUND'
          });
        }
        
        res.json({ message: 'Contraseña actualizada exitosamente' });
      });
    });
  } catch (error) {
    console.error('Change user password error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Toggle user active status (admin only)
router.patch('/:id/toggle-active', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.params.id;
    
    // Prevent admin from deactivating themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ 
        error: 'No puedes desactivar tu propia cuenta',
        code: 'CANNOT_DEACTIVATE_SELF'
      });
    }
    
    db.run(`
      UPDATE users 
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [userId], function(err) {
      if (err) {
        console.error('Error toggling user status:', err);
        return res.status(500).json({ error: 'Error cambiando estado del usuario' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }
      
      res.json({ message: 'Estado del usuario actualizado exitosamente' });
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get user activity (admin only)
router.get('/:id/activity', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.params.id;
    const { limit = 50, offset = 0 } = req.query;
    
    db.all(`
      SELECT 
        ubi.*,
        b.title as book_title,
        b.category as book_category
      FROM user_book_interactions ubi
      LEFT JOIN books b ON ubi.book_id = b.id
      WHERE ubi.user_id = ?
      ORDER BY ubi.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), parseInt(offset)], (err, interactions) => {
      if (err) {
        console.error('Error fetching user activity:', err);
        return res.status(500).json({ error: 'Error obteniendo actividad del usuario' });
      }
      
      // Get activity summary
      db.all(`
        SELECT 
          interaction_type,
          COUNT(*) as count
        FROM user_book_interactions
        WHERE user_id = ?
        GROUP BY interaction_type
      `, [userId], (err, summary) => {
        if (err) {
          console.error('Error fetching activity summary:', err);
          return res.status(500).json({ error: 'Error obteniendo resumen de actividad' });
        }
        
        res.json({
          interactions,
          summary: summary.reduce((acc, item) => {
            acc[item.interaction_type] = item.count;
            return acc;
          }, {}),
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset)
          }
        });
      });
    });
  } catch (error) {
    console.error('User activity error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;