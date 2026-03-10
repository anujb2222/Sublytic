const db = require('../models/subscriptionModel');

exports.getAllSubscriptions = (req, res) => {
  console.log('--- 1. getAllSubscriptions request received ---');
  try {
    const username = req.user.username;
    console.log(`--- 2. Fetching subscriptions for user: ${username} ---`);
    
    // The next lines are the most likely point of failure.
    const stmt = db.prepare('SELECT * FROM subscriptions WHERE username = ?');
    const subscriptions = stmt.all(username);
    
    console.log(`--- 3. Found ${subscriptions.length} subscriptions. Sending response. ---`);
    res.json(subscriptions);

  } catch (err) {
    console.error('!!! 4. A runtime error occurred in getAllSubscriptions:', err);
    res.status(500).json({
      error: 'Failed to fetch subscriptions',
      details: err.message
    });
  }
};
exports.addSubscription = (req, res) => {
  try {
    const username = req.user.username;
    const { name, category, cost, billingCycle, firstBillDate, notes, usageRating } = req.body;

    if (!name || cost === undefined || !billingCycle || !firstBillDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO subscriptions 
      (name, category, cost, billingCycle, firstBillDate, notes, usageRating, username) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, category, cost, billingCycle, firstBillDate, notes, usageRating, username);

    const newSub = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(info.lastInsertRowid);

    // Emit a real-time notification to the user
    if (req.io) {
      req.io.to(username).emit('new-notification', {
        title: 'Subscription Added!',
        message: `You've successfully added ${newSub.name}.`
      });
    }

    res.status(201).json(newSub);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add subscription', details: err.message });
  }
};

exports.updateSubscription = (req, res) => {
  try {
    const username = req.user.username;
    const { name, category, cost, billingCycle, firstBillDate, notes, usageRating } = req.body;

    if (!name || cost === undefined || !billingCycle || !firstBillDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      UPDATE subscriptions SET 
      name = ?, category = ?, cost = ?, billingCycle = ?, 
      firstBillDate = ?, notes = ?, usageRating = ? 
      WHERE id = ? AND username = ?
    `);
    const info = stmt.run(name, category, cost, billingCycle, firstBillDate, notes, usageRating, req.params.id, username);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Subscription not found or you do not have permission to edit it.' });
    }

    const updatedSub = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(req.params.id);
    res.json(updatedSub);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subscription', details: err.message });
  }
};

exports.deleteSubscription = (req, res) => {
  try {
    const username = req.user.username;
    const stmt = db.prepare('DELETE FROM subscriptions WHERE id = ? AND username = ?');
    const info = stmt.run(req.params.id, username);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Subscription not found or you do not have permission to delete it.' });
    }

    res.status(204).send(); // Standard response for a successful delete
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subscription', details: err.message });
  }
};