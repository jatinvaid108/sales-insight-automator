import axios from 'axios';

// In production, VITE_API_URL should point to your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Uploads a sales file and triggers AI summary generation + email delivery.
 * @param {File} file - The CSV or XLSX file to upload
 * @param {string} email - Recipient email address
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const uploadSalesFile = async (file, email) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60 second timeout for AI processing
  });

  return response.data;
};
