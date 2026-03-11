const csv = require('csv-parser');
const xlsx = require('xlsx');
const { Readable } = require('stream');
const path = require('path');

/**
 * Parses a CSV or XLSX buffer into an array of JSON records.
 * @param {Express.Multer.File} file - The uploaded multer file object
 * @returns {Promise<Array<Object>>} Parsed records
 */
const parse = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.csv') {
    return parseCSV(file.buffer);
  } else if (ext === '.xlsx' || ext === '.xls') {
    return parseExcel(file.buffer);
  } else {
    return Promise.reject(new Error(`Unsupported file type: ${ext}`));
  }
};

/**
 * Parse a CSV buffer using csv-parser with stream
 */
const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    // Convert buffer to readable stream for csv-parser
    const stream = Readable.from(buffer.toString('utf-8'));

    stream
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(new Error(`CSV parsing failed: ${err.message}`)));
  });
};

/**
 * Parse an Excel buffer using xlsx library
 */
const parseExcel = (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.read(buffer, { type: 'buffer' });

      // Use first sheet by default
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        return reject(new Error('Excel file contains no sheets.'));
      }

      const worksheet = workbook.Sheets[sheetName];
      const records = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

      resolve(records);
    } catch (err) {
      reject(new Error(`Excel parsing failed: ${err.message}`));
    }
  });
};

module.exports = { parse };
