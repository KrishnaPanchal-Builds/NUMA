import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'numa_db.json');

app.use(cors());
app.use(express.json());

// Initialize Database File if not exists
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      profile: null,
      cycles: [],
      timeline: [],
      symptoms: [],
      labs: [],
      documents: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  }
}

function readDb() {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { profile: null, cycles: [], timeline: [], symptoms: [], labs: [], documents: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing DB:', e);
  }
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'numa_sqlite_json_active' });
});

app.get('/api/state', (req, res) => {
  res.json(readDb());
});

app.post('/api/profile', (req, res) => {
  const db = readDb();
  db.profile = req.body;
  writeDb(db);
  res.json({ status: 'success', profile: db.profile });
});

app.post('/api/cycles', (req, res) => {
  const db = readDb();
  db.cycles.unshift(req.body);
  writeDb(db);
  res.json({ status: 'success', cycles: db.cycles });
});

app.post('/api/timeline', (req, res) => {
  const db = readDb();
  db.timeline.unshift(req.body);
  writeDb(db);
  res.json({ status: 'success', timeline: db.timeline });
});

app.post('/api/labs', (req, res) => {
  const db = readDb();
  db.labs.unshift(req.body);
  writeDb(db);
  res.json({ status: 'success', labs: db.labs });
});

app.post('/api/clear', (req, res) => {
  writeDb({ profile: null, cycles: [], timeline: [], symptoms: [], labs: [], documents: [] });
  res.json({ status: 'cleared' });
});

app.listen(PORT, () => {
  console.log(`NUMA Database Server running on port ${PORT}`);
});
