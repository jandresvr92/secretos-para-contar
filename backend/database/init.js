import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'spc.db');

let db = null;

export const getDatabase = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH);
  }
  return db;
};

export const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    // Enable foreign keys
    database.run('PRAGMA foreign_keys = ON');
    
    // Create tables
    const createTables = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student', 'external')),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Books table
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        cover_image TEXT,
        file_url TEXT,
        audio_url TEXT,
        video_url TEXT,
        category TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        downloads INTEGER DEFAULT 0,
        plays INTEGER DEFAULT 0,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
      );

      -- User book interactions table
      CREATE TABLE IF NOT EXISTS user_book_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        book_id INTEGER,
        interaction_type TEXT NOT NULL CHECK (interaction_type IN ('download', 'play_audio', 'play_video', 'view')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (book_id) REFERENCES books (id)
      );

      -- Donations table
      CREATE TABLE IF NOT EXISTS donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        donor_name TEXT NOT NULL,
        donor_email TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        donation_type TEXT NOT NULL DEFAULT 'once' CHECK (donation_type IN ('once', 'monthly')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Categories table
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
      CREATE INDEX IF NOT EXISTS idx_books_active ON books(is_active);
      CREATE INDEX IF NOT EXISTS idx_interactions_user ON user_book_interactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_interactions_book ON user_book_interactions(book_id);
    `;

    database.exec(createTables, async (err) => {
      if (err) {
        console.error('Error creating tables:', err);
        reject(err);
        return;
      }

      try {
        await seedInitialData(database);
        console.log('✅ Database initialized successfully');
        resolve(database);
      } catch (seedError) {
        console.error('❌ Error seeding initial data:', seedError);
        reject(seedError);
      }
    });
  });
};

const seedInitialData = async (database) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if data already exists
      database.get('SELECT COUNT(*) as count FROM users', async (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        if (result.count > 0) {
          console.log('📊 Database already has data, skipping seed');
          resolve();
          return;
        }

        console.log('🌱 Seeding initial data...');

        // Hash password for demo users
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Insert demo users
        const users = [
          ['Admin User', 'admin@spc.org', hashedPassword, 'admin'],
          ['Teacher User', 'teacher@spc.org', hashedPassword, 'teacher'],
          ['Student User', 'student@spc.org', hashedPassword, 'student'],
          ['External User', 'external@spc.org', hashedPassword, 'external']
        ];

        const insertUser = database.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
        
        for (const user of users) {
          insertUser.run(user);
        }
        insertUser.finalize();

        // Insert categories
        const categories = [
          ['Clásicos', 'Literatura clásica universal'],
          ['Aventuras', 'Historias de aventuras y exploración'],
          ['Educativo', 'Contenido educativo y didáctico'],
          ['Ciencia', 'Libros de ciencia y tecnología'],
          ['Historia', 'Relatos históricos y biografías'],
          ['Arte', 'Libros sobre arte y cultura']
        ];

        const insertCategory = database.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
        
        for (const category of categories) {
          insertCategory.run(category);
        }
        insertCategory.finalize();

        // Insert demo books
        const books = [
          [
            'El Principito',
            'Una hermosa historia sobre la amistad, el amor y la pérdida de la inocencia. Un clásico que ha tocado millones de corazones.',
            'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
            '/uploads/books/el-principito.pdf',
            '/uploads/audio/el-principito.mp3',
            '/uploads/video/el-principito.mp4',
            'Clásicos',
            1250,
            890,
            1
          ],
          [
            'Cuentos de la Selva',
            'Aventuras mágicas en la selva con animales que hablan y enseñan valiosas lecciones de vida.',
            'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
            '/uploads/books/cuentos-selva.pdf',
            '/uploads/audio/cuentos-selva.mp3',
            null,
            'Aventuras',
            980,
            654,
            2
          ],
          [
            'Matemáticas Divertidas',
            'Aprende matemáticas de forma divertida con juegos, ejercicios y explicaciones claras para niños.',
            'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
            '/uploads/books/matematicas-divertidas.pdf',
            null,
            '/uploads/video/matematicas-divertidas.mp4',
            'Educativo',
            756,
            432,
            2
          ],
          [
            'Historia del Arte',
            'Un recorrido fascinante por la historia del arte desde las pinturas rupestres hasta el arte contemporáneo.',
            'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
            '/uploads/books/historia-arte.pdf',
            '/uploads/audio/historia-arte.mp3',
            '/uploads/video/historia-arte.mp4',
            'Arte',
            543,
            321,
            1
          ],
          [
            'Ciencias Naturales',
            'Descubre los secretos de la naturaleza con experimentos, observaciones y explicaciones científicas.',
            'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
            '/uploads/books/ciencias-naturales.pdf',
            null,
            '/uploads/video/ciencias-naturales.mp4',
            'Ciencia',
            432,
            234,
            2
          ],
          [
            'Grandes Exploradores',
            'Las aventuras de los grandes exploradores que cambiaron el mundo con sus descubrimientos.',
            'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
            '/uploads/books/grandes-exploradores.pdf',
            '/uploads/audio/grandes-exploradores.mp3',
            null,
            'Historia',
            678,
            456,
            1
          ]
        ];

        const insertBook = database.prepare(`
          INSERT INTO books (title, description, cover_image, file_url, audio_url, video_url, category, downloads, plays, created_by) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const book of books) {
          insertBook.run(book);
        }
        insertBook.finalize();

        console.log('✅ Initial data seeded successfully');
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
  }
};