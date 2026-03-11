require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Sales Insight Automator API running on port ${PORT}`);
  console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
});
