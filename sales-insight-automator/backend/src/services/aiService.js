const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Limit dataset size sent to LLM to avoid token overflows
const MAX_RECORDS_FOR_LLM = 200;

/**
 * Generates an executive sales summary using the Groq LLM API.
 * @param {Array<Object>} records - Parsed sales records
 * @returns {Promise<string>} AI-generated executive summary
 */
const generateSummary = async (records) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.');
  }

  // Truncate large datasets to avoid token limit issues
  const sampleRecords = records.slice(0, MAX_RECORDS_FOR_LLM);
  const datasetText = JSON.stringify(sampleRecords, null, 2);

  const prompt = buildPrompt(datasetText, records.length, sampleRecords.length);

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const summary = response.data?.choices?.[0]?.message?.content;

    if (!summary) {
      throw new Error('AI returned an empty response. Please try again.');
    }

    return summary.trim();
  } catch (error) {
    if (error.response) {
      // Groq API returned an error response
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Unknown API error';
      throw new Error(`Groq API error (${status}): ${message}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('AI service timed out. Please try again.');
    } else {
      throw new Error(`AI service error: ${error.message}`);
    }
  }
};

/**
 * Builds the LLM prompt with the dataset and instructions.
 */
const buildPrompt = (datasetText, totalRecords, sampledRecords) => {
  const truncationNote =
    totalRecords > sampledRecords
      ? `Note: Dataset was truncated to ${sampledRecords} records (out of ${totalRecords} total) for analysis.`
      : '';

  return `You are a professional sales data analyst working for an executive team.

Analyze the following sales dataset and generate a concise, professional executive summary.

Focus your analysis on:
- Overall revenue trends and performance
- Best performing region or territory
- Best performing product category or SKU
- Top sales representatives (if data available)
- Key actionable insights
- Any anomalies, outliers, or areas of concern

Keep the summary clear, data-driven, and suitable for a C-suite audience.
Use bullet points for key insights and keep the total length under 400 words.

${truncationNote}

Dataset:
${datasetText}`;
};

module.exports = { generateSummary };
