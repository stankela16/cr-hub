const Partner = require('../models/Partner');

// Vraćanje svih partnera ili pretraga po nazivu kompanije
const vratiSvePartnere = (req, res) => {
  const searchQuery = req.query.search;

  let filter = {};
  if (searchQuery) {
      filter.naziv = { $regex: searchQuery, $options: 'i' }; // Case-insensitive pretraga
  }

  Partner.find(filter).sort({ createdAt: -1 })
      .then(partneri => {
          res.render('pocetna', { 
              title: 'Svi partneri', 
              partneri: partneri,
              search: searchQuery // Dodajemo search query da bi se prikazao u input polju
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).send('Došlo je do greške prilikom dobijanja partnera.');
      });
}

const kreirajNovogPartnera = (req, res) => {
  // Provera i pretvaranje niza u string, ako je potrebno
  if (Array.isArray(req.body.kontaktOsoba)) {
      req.body.kontaktOsoba = req.body.kontaktOsoba.join(', '); // Kombinovanje vrednosti u jedan string
  }

  const partner = new Partner(req.body);

  partner.save()
      .then(result => {
          res.redirect('/');
      })
      .catch(err => {
          console.log(err);

          let errors = {};  // Inicijalizacija `errors`

          if (err.name === 'ValidationError') {
              Object.keys(err.errors).forEach(key => {
                  errors[key] = err.errors[key].message;
              });

              // Renderuj stranicu sa unetim podacima i greškama
              res.status(400).render('dodajPartnera', { 
                  title: 'Kreiraj novog partnera', 
                  errors: errors, 
                  partner: req.body || {} 
              });
          } else {
              errors.general = 'Došlo je do greške prilikom kreiranja partnera.';
              res.status(500).render('dodajPartnera', {
                  title: 'Kreiraj novog partnera',
                  errors: errors,
                  partner: req.body || {}
              });
          }
      });
};

// Brisanje partnera
const obrisiPartnera = (req, res) => {
  const id = req.params.id;

  Partner.findByIdAndDelete(id)
      .then(result => {
          res.redirect('/');
      })
      .catch(err => {
          console.log(err);
          res.status(500).send('Došlo je do greške prilikom brisanja partnera.');
      });
}


// Eksportovanje funkcija
module.exports = {
    vratiSvePartnere,
    kreirajNovogPartnera,
    obrisiPartnera
}
