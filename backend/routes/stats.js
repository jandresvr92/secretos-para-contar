import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public stats
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    
    // Get basic public statistics
    const queries = [
      'SELECT COUNT(*) as totalBooks FROM books WHERE is_active = 1',
      'SELECT COUNT(*) as totalUsers FROM users WHERE is_active = 1',
      'SELECT SUM(downloads) as totalDownloads FROM books WHERE is_active = 1',
      'SELECT SUM(plays) as totalPlays FROM books WHERE is_active = 1',
      'SELECT COUNT(DISTINCT category) as totalCategories FROM books WHERE is_active = 1'
    ];
    
    Promise.all(queries.map(query => 
      new Promise((resolve, reject) => {
        db.get(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      })
    )).then(results => {
      const [books, users, downloads, plays, categories] = results;
      
      res.json({
        totalBooks: books.totalBooks || 0,
        totalUsers: users.totalUsers || 0,
        totalDownloads: downloads.totalDownloads || 0,
        totalPlays: plays.totalPlays || 0,
        totalCategories: categories.totalCategories || 0
      });
    }).catch(error => {
      console.error('Error fetching public stats:', error);
      res.status(500).json({ error: 'Error obteniendo estadísticas' });
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Admin stats (detailed)
router.get('/admin', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const db = getDatabase();
    
    const queries = [
      // Basic counts
      'SELECT COUNT(*) as totalBooks FROM books',
      'SELECT COUNT(*) as activeBooks FROM books WHERE is_active = 1',
      'SELECT COUNT(*) as totalUsers FROM users',
      'SELECT COUNT(*) as activeUsers FROM users WHERE is_active = 1',
      'SELECT SUM(downloads) as totalDownloads FROM books',
      'SELECT SUM(plays) as totalPlays FROM books',
      
      // Users by role
      `SELECT role, COUNT(*) as count FROM users WHERE is_active = 1 GROUP BY role`,
      
      // Books by category
      `SELECT category, COUNT(*) as count FROM books WHERE is_active = 1 GROUP BY category ORDER BY count DESC`,
      
      // Top books by downloads
      `SELECT title, downloads, plays FROM books WHERE is_active = 1 ORDER BY downloads DESC LIMIT 10`,
      
      // Recent activity (last 30 days)
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as interactions
       FROM user_book_interactions 
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      
      // Monthly registrations (last 12 months)
      `SELECT 
         strftime('%Y-%m', created_at) as month,
         COUNT(*) as registrations
       FROM users 
       WHERE created_at >= datetime('now', '-12 months')
       GROUP BY strftime('%Y-%m', created_at)
       ORDER BY month DESC`
    ];
    
    Promise.all(queries.map(query => 
      new Promise((resolve, reject) => {
        db.all(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      })
    )).then(results => {
      const [
        totalBooks, activeBooks, totalUsers, activeUsers, 
        totalDownloads, totalPlays, usersByRole, booksByCategory,
        topBooks, recentActivity, monthlyRegistrations
      ] = results;
      
      res.json({
        overview: {
          totalBooks: totalBooks[0]?.totalBooks || 0,
          activeBooks: activeBooks[0]?.activeBooks || 0,
          totalUsers: totalUsers[0]?.totalUsers || 0,
          activeUsers: activeUsers[0]?.activeUsers || 0,
          totalDownloads: totalDownloads[0]?.totalDownloads || 0,
          totalPlays: totalPlays[0]?.totalPlays || 0
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item.count;
          return acc;
        }, {}),
        booksByCategory: booksByCategory,
        topBooks: topBooks,
        recentActivity: recentActivity,
        monthlyRegistrations: monthlyRegistrations
      });
    }).catch(error => {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ error: 'Error obteniendo estadísticas de administrador' });
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// User personal stats
router.get('/user', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    
    const queries = [
      // User's total interactions
      `SELECT 
         interaction_type,
         COUNT(*) as count
       FROM user_book_interactions 
       WHERE user_id = ?
       GROUP BY interaction_type`,
      
      // User's favorite categories (most interacted)
      `SELECT 
         b.category,
         COUNT(*) as interactions
       FROM user_book_interactions ubi
       JOIN books b ON ubi.book_id = b.id
       WHERE ubi.user_id = ?
       GROUP BY b.category
       ORDER BY interactions DESC
       LIMIT 5`,
      
      // User's recent activity
      `SELECT 
         ubi.*,
         b.title as book_title,
         b.category as book_category
       FROM user_book_interactions ubi
       JOIN books b ON ubi.book_id = b.id
       WHERE ubi.user_id = ?
       ORDER BY ubi.created_at DESC
       LIMIT 10`,
      
      // User's reading streak (days with activity in last 30 days)
      `SELECT 
         COUNT(DISTINCT DATE(created_at)) as activeDays
       FROM user_book_interactions
       WHERE user_id = ? AND created_at >= datetime('now', '-30 days')`
    ];
    
    Promise.all(queries.map((query, index) => 
      new Promise((resolve, reject) => {
        const params = index === 0 || index === 1 || index === 2 || index === 3 ? [userId] : [];
        db.all(query, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      })
    )).then(results => {
      const [interactions, favoriteCategories, recentActivity, streak] = results;
      
      res.json({
        interactions: interactions.reduce((acc, item) => {
          acc[item.interaction_type] = item.count;
          return acc;
        }, {}),
        favoriteCategories: favoriteCategories,
        recentActivity: recentActivity,
        activeDaysThisMonth: streak[0]?.activeDays || 0
      });
    }).catch(error => {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Error obteniendo estadísticas del usuario' });
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Category stats
router.get('/categories', optionalAuth, (req, res) => {
  try {
    const db = getDatabase();
    
    db.all(`
      SELECT 
        category,
        COUNT(*) as bookCount,
        SUM(downloads) as totalDownloads,
        SUM(plays) as totalPlays,
        AVG(downloads) as avgDownloads,
        AVG(plays) as avgPlays
      FROM books 
      WHERE is_active = 1
      GROUP BY category
      ORDER BY bookCount DESC
    `, (err, categories) => {
      if (err) {
        console.error('Error fetching category stats:', err);
        return res.status(500).json({ error: 'Error obteniendo estadísticas de categorías' });
      }
      
      res.json({ categories });
    });
  } catch (error) {
    console.error('Category stats error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;