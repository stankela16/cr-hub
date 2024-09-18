const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
    naziv: {
        type: String,
        required: [true, "Naziv je obavezan"],
        minlength: [3, "Naziv mora imati najmanje 3 karaktera"]
    },
    kontaktOsoba: {
        type: String,
        required: [true, "Kontakt osoba je obavezna"],
        minlength: [3, "Ime kontakt osobe mora imati najmanje 3 karaktera"]
    },
    kontaktMejl: {
        type: String,
        required: [true, "Kontakt mejl je obavezan"],
        match: [/.+\@.+\..+/, "Molimo unesite važeću e-mail adresu"]
    },
    kontaktTelefon: {
        type: String,
        required: [true, "Kontakt telefon je obavezan"],
        match: [/^\d{8,15}$/, "Kontakt telefon mora imati između 8 i 15 cifara"]
    }
});

// Eksportovanje modela
module.exports = mongoose.model("Partner", partnerSchema);
