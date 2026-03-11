const express = require('express');
const router = express.Router();
const { handleUpload } = require('../controllers/uploadController');
const validateFile = require('../middleware/validateFile');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a sales CSV/XLSX file and receive an AI summary via email
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX file (max 5MB)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *     responses:
 *       200:
 *         description: Summary sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Summary sent successfully
 *       400:
 *         description: Validation error (invalid file type, size, or missing fields)
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
router.post('/upload', validateFile, handleUpload);

module.exports = router;
