import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Auth validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe tener un formato válido',
    'any.required': 'El email es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida'
  })
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es requerido'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe tener un formato válido',
    'any.required': 'El email es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida'
  }),
  role: Joi.string().valid('student', 'external').default('student')
});

// Book validation schemas
export const createBookSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.min': 'El título es requerido',
    'string.max': 'El título no puede exceder 200 caracteres',
    'any.required': 'El título es requerido'
  }),
  description: Joi.string().max(1000).allow('').messages({
    'string.max': 'La descripción no puede exceder 1000 caracteres'
  }),
  category: Joi.string().required().messages({
    'any.required': 'La categoría es requerida'
  }),
  cover_image: Joi.string().uri().allow('').messages({
    'string.uri': 'La imagen de portada debe ser una URL válida'
  }),
  file_url: Joi.string().allow(''),
  audio_url: Joi.string().allow(''),
  video_url: Joi.string().allow('')
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(200).messages({
    'string.min': 'El título no puede estar vacío',
    'string.max': 'El título no puede exceder 200 caracteres'
  }),
  description: Joi.string().max(1000).allow('').messages({
    'string.max': 'La descripción no puede exceder 1000 caracteres'
  }),
  category: Joi.string(),
  cover_image: Joi.string().uri().allow('').messages({
    'string.uri': 'La imagen de portada debe ser una URL válida'
  }),
  file_url: Joi.string().allow(''),
  audio_url: Joi.string().allow(''),
  video_url: Joi.string().allow(''),
  is_active: Joi.boolean()
});

// User validation schemas
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres'
  }),
  email: Joi.string().email().messages({
    'string.email': 'El email debe tener un formato válido'
  }),
  role: Joi.string().valid('admin', 'teacher', 'student', 'external'),
  is_active: Joi.boolean()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'La contraseña actual es requerida'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
    'any.required': 'La nueva contraseña es requerida'
  })
});

// Donation validation schema
export const donationSchema = Joi.object({
  donor_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres',
    'any.required': 'El nombre es requerido'
  }),
  donor_email: Joi.string().email().required().messages({
    'string.email': 'El email debe tener un formato válido',
    'any.required': 'El email es requerido'
  }),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'El monto debe ser mayor a 0',
    'any.required': 'El monto es requerido'
  }),
  donation_type: Joi.string().valid('once', 'monthly').default('once')
});