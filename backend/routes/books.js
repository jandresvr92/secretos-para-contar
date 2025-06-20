import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { validateRequest, createBookSchema, updateBookSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all books (public with optional auth for personalization)
// Admin and teachers can see all books including inactive ones
router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDatabase();
    const { category, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        b.*,
        u.name as created_by_name
      FROM books b
      LEFT JOIN users u ON b.created_by = u.id
    `;
    
    const params = [];
    
    // Only show active books to non-admin users
    if (!req.user || req.user.role !== 'admin') {
      query += ' WHERE b.is_active = 1';
    } else {
      query += ' WHERE 1=1';
    }
    
    // Add category filter
    if (category && category !== 'Todos') {
      query += ' AND b.category = ?';
      params.push(category);
    }
    
    // Add search filter
    if (search) {
      query += ' AND (b.title LIKE ? OR b.description LIKE ? OR b.category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    db.all(query, params, (err, books) => {
      if (err) {
        console.error('Error fetching books:', err);
        return res.status(500).json({ error: 'Error obteniendo libros' });
      }
      
      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM books b';
      const countParams = [];
      
      if (!req.user || req.user.role !== 'admin') {
        countQuery += ' WHERE b.is_active = 1';
      } else {
        countQuery += ' WHERE 1=1';
      }
      
      if (category && category !== 'Todos') {
        countQuery += ' AND b.category = ?';
        countParams.push(category);
      }
      
      if (search) {
        countQuery += ' AND (b.title LIKE ? OR b.description LIKE ? OR b.category LIKE ?)';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          console.error('Error counting books:', err);
          return res.status(500).json({ error: 'Error contando libros' });
        }
        
        res.json({
          books: books || [],
          pagination: {
            total: countResult?.total || 0,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parseInt(limit) < (countResult?.total || 0)
          }
        });
      });
    });
  } catch (error) {
    console.error('Books list error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get single book
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const db = getDatabase();
    const bookId = req.params.id;
    
    let query = `
      SELECT 
        b.*,
        u.name as created_by_name
      FROM books b
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.id = ?
    `;
    
    const params = [bookId];
    
    // Only show active books to non-admin users
    if (!req.user || req.user.role !== 'admin') {
      query += ' AND b.is_active = 1';
    }
    
    db.get(query, params, (err, book) => {
      if (err) {
        console.error('Error fetching book:', err);
        return res.status(500).json({ error: 'Error obteniendo libro' });
      }
      
      if (!book) {
        return res.status(404).json({ 
          error: 'Libro no encontrado',
          code: 'BOOK_NOT_FOUND'
        });
      }
      
      res.json({ book });
    });
  } catch (error) {
    console.error('Book detail error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Create book (admin only)
router.post('/', authenticateToken, requireRole(['admin']), validateRequest(createBookSchema), (req, res) => {
  try {
    const db = getDatabase();
    const { title, description, category, cover_image, file_url, audio_url, video_url } = req.body;
    
    db.run(`
      INSERT INTO books (title, description, category, cover_image, file_url, audio_url, video_url, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, category, cover_image || null, file_url || null, audio_url || null, video_url || null, req.user.id], function(err) {
      if (err) {
        console.error('Error creating book:', err);
        return res.status(500).json({ error: 'Error creando libro' });
      }
      
      // Get the created book
      db.get(`
        SELECT 
          b.*,
          u.name as created_by_name
        FROM books b
        LEFT JOIN users u ON b.created_by = u.id
        WHERE b.id = ?
      `, [this.lastID], (err, book) => {
        if (err) {
          console.error('Error fetching created book:', err);
          return res.status(500).json({ error: 'Error obteniendo libro creado' });
        }
        
        res.status(201).json({
          message: 'Libro creado exitosamente',
          book
        });
      });
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update book (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), validateRequest(updateBookSchema), (req, res) => {
  try {
    const db = getDatabase();
    const bookId = req.params.id;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = Object.keys(updates).filter(key => updates[key] !== undefined);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    values.push(bookId);
    
    db.run(`
      UPDATE books 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, values, function(err) {
      if (err) {
        console.error('Error updating book:', err);
        return res.status(500).json({ error: 'Error actualizando libro' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          error: 'Libro no encontrado',
          code: 'BOOK_NOT_FOUND'
        });
      }
      
      // Get updated book
      db.get(`
        SELECT 
          b.*,
          u.name as created_by_name
        FROM books b
        LEFT JOIN users u ON b.created_by = u.id
        WHERE b.id = ?
      `, [bookId], (err, book) => {
        if (err) {
          console.error('Error fetching updated book:', err);
          return res.status(500).json({ error: 'Error obteniendo libro actualizado' });
        }
        
        res.json({
          message: 'Libro actualizado exitosamente',
          book
        });
      });
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Toggle book active status (admin only)
router.patch('/:id/toggle-active', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const db = getDatabase();
    const bookId = req.params.id;
    
    // First check if book exists
    db.get('SELECT id, title, is_active FROM books WHERE id = ?', [bookId], (err, book) => {
      if (err) {
        console.error('Error checking book:', err);
        return res.status(500).json({ error: 'Error verificando libro' });
      }
      
      if (!book) {
        return res.status(404).json({ 
          error: 'Libro no encontrado',
          code: 'BOOK_NOT_FOUND'
        });
      }
      
      // Toggle the active status
      db.run(`
        UPDATE books 
        SET is_active = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [book.is_active ? 0 : 1, bookId], function(err) {
        if (err) {
          console.error('Error toggling book status:', err);
          return res.status(500).json({ error: 'Error cambiando estado del libro' });
        }
        
        const newStatus = book.is_active ? 0 : 1;
        res.json({ 
          message: 'Estado del libro actualizado exitosamente',
          book: {
            ...book,
            is_active: newStatus
          }
        });
      });
    });
  } catch (error) {
    console.error('Toggle book status error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Record book interaction (authenticated users only)
router.post('/:id/interact', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const bookId = req.params.id;
    const { interaction_type } = req.body;
    
    if (!['download', 'play_audio', 'play_video', 'view'].includes(interaction_type)) {
      return res.status(400).json({ 
        error: 'Tipo de interacción inválido',
        code: 'INVALID_INTERACTION_TYPE'
      });
    }
    
    // Check if book exists and is active
    db.get('SELECT id, is_active FROM books WHERE id = ?', [bookId], (err, book) => {
      if (err) {
        console.error('Error checking book for interaction:', err);
        return res.status(500).json({ error: 'Error verificando libro' });
      }
      
      if (!book) {
        return res.status(404).json({ 
          error: 'Libro no encontrado',
          code: 'BOOK_NOT_FOUND'
        });
      }
      
      if (!book.is_active) {
        return res.status(403).json({ 
          error: 'Libro no disponible',
          code: 'BOOK_NOT_ACTIVE'
        });
      }
      
      // Record interaction
      db.run(`
        INSERT INTO user_book_interactions (user_id, book_id, interaction_type)
        VALUES (?, ?, ?)
      `, [req.user.id, bookId, interaction_type], (err) => {
        if (err) {
          console.error('Error recording interaction:', err);
          return res.status(500).json({ error: 'Error registrando interacción' });
        }
        
        // Update book counters
        let updateField = '';
        if (interaction_type === 'download') {
          updateField = 'downloads = downloads + 1';
        } else if (interaction_type === 'play_audio' || interaction_type === 'play_video') {
          updateField = 'plays = plays + 1';
        }
        
        if (updateField) {
          db.run(`UPDATE books SET ${updateField} WHERE id = ?`, [bookId], (err) => {
            if (err) {
              console.error('Error updating book counters:', err);
            }
          });
        }
        
        res.json({ message: 'Interacción registrada exitosamente' });
      });
    });
  } catch (error) {
    console.error('Record interaction error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get categories
router.get('/meta/categories', (req, res) => {
  try {
    const db = getDatabase();
    
    db.all(`
      SELECT DISTINCT category as name, COUNT(*) as count
      FROM books 
      WHERE is_active = 1 
      GROUP BY category 
      ORDER BY category
    `, (err, categories) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ error: 'Error obteniendo categorías' });
      }
      
      res.json({ categories: categories || [] });
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;