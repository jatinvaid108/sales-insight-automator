// OpenAPI 3.0 spec — built manually, no extra dependencies needed
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Sales Insight Automator API',
    version: '1.0.0',
    description:
      'API for uploading sales CSV/XLSX files and receiving AI-generated executive summaries via email.',
    contact: {
      name: 'Rabbitt AI',
    },
  },
  servers: [
    {
      url: process.env.BACKEND_URL || 'http://localhost:5000',
      description: 'Development / Production Server',
    },
  ],
  tags: [
    {
      name: 'Upload',
      description: 'File upload and AI summary generation',
    },
    {
      name: 'Health',
      description: 'Service health check',
    },
  ],
  paths: {
    '/api/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Upload sales file and receive AI summary via email',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file', 'email'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV or XLSX file (max 5MB)',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Recipient email address for the summary',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Summary generated and sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Summary sent successfully' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error (missing fields, invalid file type/size)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'File size exceeds 5MB limit.' },
                  },
                },
              },
            },
          },
          429: {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Too many requests. Try again after 15 minutes.',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'An unexpected error occurred.' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: {
                      type: 'string',
                      example: 'Sales Insight Automator API',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;