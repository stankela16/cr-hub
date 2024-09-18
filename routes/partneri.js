const express = require("express");
const router = express.Router();
const partnerController = require('../controller/partneri');

// GET - Vraća sve partnere
router.get("/", partnerController.vratiSvePartnere);

// GET - Prikazuje formu za dodavanje novog partnera
router.get("/dodaj", (req, res) => {
  res.render('dodajPartnera', { title: 'Dodaj Partnera', partner: {} });
});

// POST - Kreira novog partnera
router.post("/putanja_za_dodavanje_partnera", partnerController.kreirajNovogPartnera);

// DELETE - Briše partnera po ID-u
router.delete("/partneri/:id", partnerController.obrisiPartnera);

module.exports = router;
