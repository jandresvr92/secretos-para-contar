import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '..', 'uploads');
const subdirs = ['books', 'covers', 'audio', 'video'];

subdirs.forEach(subdir => {
  const dir = path.join(uploadDir, subdir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subdir = 'books'; // default
    
    if (file.fieldname === 'cover') subdir = 'covers';
    else if (file.fieldname === 'audio') subdir = 'audio';
    else if (file.fieldname === 'video') subdir = 'video';
    else if (file.fieldname === 'book' || file.fieldname === 'pdf') subdir = 'books';
    
    cb(null, path.join(uploadDir, subdir));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'book': ['.pdf'],
    'pdf': ['.pdf'],
    'cover': ['.jpg', '.jpeg', '.png', '.webp'],
    'audio': ['.mp3', '.wav', '.ogg'],
    'video': ['.mp4', '.webm', '.ogg']
  };
  
  const ext = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || allowedTypes['book'];
  
  if (fieldAllowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido para ${file.fieldname}. Tipos permitidos: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Upload single file
router.post('/single', authenticateToken, requireRole(['admin', 'teacher']), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No se ha subido ningún archivo',
        code: 'NO_FILE'
      });
    }
    
    const fileUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;
    
    res.json({
      message: 'Archivo subido exitosamente',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Single upload error:', error);
    res.status(500).json({ error: 'Error subiendo archivo' });
  }
});

// Upload multiple files for a book
router.post('/book', authenticateToken, requireRole(['admin', 'teacher']), (req, res) => {
  const uploadFields = upload.fields([
    { name: 'book', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]);
  
  uploadFields(req, res, (err) => {
    if (err) {
      console.error('Book upload error:', err);
      return res.status(400).json({ 
        error: err.message || 'Error subiendo archivos',
        code: 'UPLOAD_ERROR'
      });
    }
    
    try {
      const files = {};
      
      if (req.files) {
        Object.keys(req.files).forEach(fieldname => {
          const file = req.files[fieldname][0];
          const fileUrl = `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`;
          
          files[fieldname] = {
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            url: fileUrl
          };
        });
      }
      
      res.json({
        message: 'Archivos subidos exitosamente',
        files
      });
    } catch (error) {
      console.error('Book upload processing error:', error);
      res.status(500).json({ error: 'Error procesando archivos subidos' });
    }
  });
});

// Delete file
router.delete('/:filename', authenticateToken, requireRole(['admin', 'teacher']), (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Find file in subdirectories
    let filePath = null;
    for (const subdir of subdirs) {
      const testPath = path.join(uploadDir, subdir, filename);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }
    
    if (!filePath) {
      return res.status(404).json({ 
        error: 'Archivo no encontrado',
        code: 'FILE_NOT_FOUND'
      });
    }
    
    fs.unlinkSync(filePath);
    
    res.json({ message: 'Archivo eliminado exitosamente' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Error eliminando archivo' });
  }
});

// Get file info
router.get('/info/:filename', authenticateToken, requireRole(['admin', 'teacher']), (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Find file in subdirectories
    let filePath = null;
    let subdir = null;
    for (const dir of subdirs) {
      const testPath = path.join(uploadDir, dir, filename);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        subdir = dir;
        break;
      }
    }
    
    if (!filePath) {
      return res.status(404).json({ 
        error: 'Archivo no encontrado',
        code: 'FILE_NOT_FOUND'
      });
    }
    
    const stats = fs.statSync(filePath);
    
    res.json({
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      type: subdir,
      url: `/uploads/${subdir}/${filename}`
    });
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ error: 'Error obteniendo información del archivo' });
  }
});

// List files in directory
router.get('/list/:type', authenticateToken, requireRole(['admin', 'teacher']), (req, res) => {
  try {
    const type = req.params.type;
    
    if (!subdirs.includes(type)) {
      return res.status(400).json({ 
        error: 'Tipo de archivo inválido',
        code: 'INVALID_FILE_TYPE',
        allowedTypes: subdirs
      });
    }
    
    const dirPath = path.join(uploadDir, type);
    
    if (!fs.existsSync(dirPath)) {
      return res.json({ files: [] });
    }
    
    const files = fs.readdirSync(dirPath).map(filename => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/${type}/${filename}`
      };
    });
    
    res.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Error listando archivos' });
  }
});

export default router;