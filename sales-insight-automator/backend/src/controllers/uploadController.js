const fileParser = require('../services/fileParser');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');

/**
 * Handles the full pipeline:
 * 1. Parse uploaded file
 * 2. Generate AI summary
 * 3. Send summary via email
 * 4. Return success response
 */
const handleUpload = async (req, res, next) => {
  try {
    const { email } = req.body;
    const file = req.file;

    // Validate email presence
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid recipient email address is required.',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.',
      });
    }

    console.log(`[Upload] Processing file: ${file.originalname} for: ${email}`);

    // Step 1: Parse the file into JSON records
    const records = await fileParser.parse(file);

    if (!records || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded file appears to be empty or could not be parsed.',
      });
    }

    console.log(`[Upload] Parsed ${records.length} records from ${file.originalname}`);

    // Step 2: Generate AI executive summary
    const summary = await aiService.generateSummary(records);

    console.log(`[Upload] AI summary generated successfully`);

    // Step 3: Send summary via email
    await emailService.sendSummary(email.trim(), summary, file.originalname);

    console.log(`[Upload] Email sent to ${email}`);

    // Step 4: Respond with success
    return res.status(200).json({
      success: true,
      message: 'Summary sent successfully',
    });
  } catch (error) {
    // Pass error to centralized error handler
    next(error);
  }
};

module.exports = { handleUpload };
