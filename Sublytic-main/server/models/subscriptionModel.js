// Subscription model for SQLite using better-sqlite3
const db = require('../config/db');

db.prepare(`CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  cost REAL NOT NULL,
  billingCycle TEXT NOT NULL,
  firstBillDate TEXT NOT NULL,
  notes TEXT,
  usageRating INTEGER,
  username TEXT NOT NULL
)`).run();

module.exports = db;
