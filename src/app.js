const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nextTopperRoutes = require('./routes/nextTopper');

const app = express();

const ADMIN_PASSWORD = 'amanraj@64';  // 🔑 Change this to your desired admin password

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/next-topper', nextTopperRoutes);

// View counter middleware
app.use((req, res, next) => {
  const filePath = path.join(__dirname, '..', 'viewsCount.json');
  let data = { count: 0 };

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  data.count += 1;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  next();
});

// Homepage
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'viewsCount.json');
  let data = { count: 0 };

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  res.render('home', { count: data.count });
});

// Admin panel GET with simple password check
app.get('/admin', (req, res) => {
  const { pass } = req.query;
  if (pass === ADMIN_PASSWORD) {
    res.render('admin');
  } else {
    res.send(`
      <h1>Admin Login</h1>
      <form method="get" action="/admin">
        <input type="password" name="pass" placeholder="Enter admin password" required />
        <button type="submit">Login</button>
      </form>
    `);
  }
});

// Handle content addition
app.post('/admin/add', (req, res) => {
  const { title, description, link, category, subcategory } = req.body;
  const filePath = path.join(__dirname, '..', 'content.json');
  let data = {};

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  if (!data[category]) data[category] = {};
  if (!data[category][subcategory]) data[category][subcategory] = [];

  data[category][subcategory].push({ title, description, link });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));