const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected:', MONGO_URI))
  .catch((err) => console.error('MongoDB connection error:', err.message));

const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  value: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', CounterSchema);

const MessageSchema = new mongoose.Schema({
  name: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', MessageSchema);

app.get('/healthz', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(dbState === 1 ? 200 : 503).json({ status: dbState === 1 ? 'ok' : 'db_down' });
});

app.get('/api/visits', async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'portfolio_visits' },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );
    res.json({ visits: counter.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'name and message are required' });
    }
    const doc = await Message.create({ name, message });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));