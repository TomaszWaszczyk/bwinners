const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: 5432
    });
  }

  async saveOddsData(data) {
    // Implement bulk insert/update logic
  }
}
