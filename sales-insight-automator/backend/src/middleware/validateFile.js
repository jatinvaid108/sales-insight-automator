const multer = require('multer');
const path = require('path');

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];
const ALLOWED_MIMETYPES = [
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain', // some systems send CSV as text/plain
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Multer storage config — use memory storage (no disk writes).
 * Buffers the file in memory for immediate parsing.
 */
const storage = multer.memoryStorage();

/**
 * Multer file filter: rejects disallowed file types early.
 */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        `Invalid file type "${ext}". Only CSV and XLSX files are allowed.`
      ),
      false
    );
  }

  cb(null, true);
};

/**
 * Configured multer instance.
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
}).single('file');

/**
 * Middleware wrapper: runs multer upload and handles its errors gracefully.
 */
const validateFile = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds the 5MB limit. Please upload a smaller file.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error.',
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'An error occurred during file upload.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach a CSV or XLSX file.',
      });
    }

    next();
  });
};

module.exports = validateFile;
