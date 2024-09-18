require('dotenv').config(); // Učitava konfiguracioni fajl .env
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

// Postavljanje view engine-a
app.set('view engine', 'ejs');

// Middleware za parsiranje URL kodiranih podataka
app.use(express.urlencoded({ extended: true }));

// Middleware za serviranje statičkih fajlova
app.use(express.static('public'));

// Korišćenje method-override za podršku DELETE i PUT metodama preko POST zahteva
app.use(methodOverride('_method'));

// Adresa baze podataka
const uri = process.env.MONGODB_URI;

// Opcije za povezivanje sa bazom podataka
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  ssl: true,
  authSource: 'admin',
  replicaSet: 'atlas-irsk8n-shard-0',
  retryWrites: true,
  w: 'majority'
};

// Povezivanje sa bazom podataka
mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to database');

    // Slušanje na portu
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('Listening for requests on port', PORT);
    });
  })
  .catch((err) => {
    console.log('Database connection error:', err);
  });

// Upravljanje događajima grešaka MongoDB-a
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Reconnecting...');
  mongoose.connect(uri, options);
});

// Uvođenje rute za partnere
const partneriRouter = require("./routes/partneri");
app.use("/", partneriRouter);

// Middleware za hvatanje 404 grešaka
app.use((req, res, next) => {
  res.status(404).render('404', { url: req.originalUrl });
});

// Middleware za hvatanje grešaka
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err }); // Renderuje error.ejs sa detaljima greške
});
