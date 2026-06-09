const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./infrastructure/web/app');

const PORT = process.env.PORT || 4000;

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`));
}
