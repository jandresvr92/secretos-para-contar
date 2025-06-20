export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    message: `La ruta ${req.method} ${req.originalUrl} no existe`
  });
};