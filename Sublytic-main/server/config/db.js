// config/db.js
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Explicitly load .env from the server root

// Resolve the path from the current file's directory
const dbPath = path.resolve(__dirname, process.env.DB_FILE || '../database.sqlite');

console.log(`Attempting to connect to database at: ${dbPath}`); // For debugging

const db = new Database(dbPath, { verbose: console.log });

module.exports = db;