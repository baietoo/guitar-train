// se va crea obiect server express care va asculta 8080
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const express = require('express');
const app = express();
const port = 8080;

obGlobal = {
    obErori: null,
    obImagini: null
}

vect_foldere = ["temp", "backup"]
for(let folder of vect_foldere){
    let caleFolder  = path.join(__dirname, folder);
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

// set views folder

app.set('view engine', 'ejs');
app.set('views', './views');
// app.set('resurse', './resurse');
app.use('/resurse', express.static(__dirname + '/resurse'));

//app.get să se poată accesa atât cu localhost:8080 cât și cu localhost:8080/index,  localhost:8080/home. Realizați acest lucru folosinf un vector în apelul app.get() care transmite pagina principală
app.get(['/', '/index', '/home'], (req, res) => {
    res.render('pagini/index', {ip:req.ip, imagini: obGlobal.obImagini.imagini});
});

app.get(['/despre'], (req, res) => {
    res.render('pagini/despre');
});

// Se va seta un view engine pentru a folosi ejs (app.set('view engine', 'ejs'))
// render ejs template
app.get('/pagina', (req, res) => {
    res.render('pagina');
}
);

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon.ico"));
});

app.get(new RegExp("^\/resurse\/[a-zA-Z0-9_\/-]+$"), (req, res) => {
    afisareEroare(res, 403);
});


app.get('/*.ejs', (req, res) => {
    afisareEroare(res, 400);
});


function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("UTF-8");
    obGlobal.obErori = JSON.parse(continut);
    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    let err_def = obGlobal.obErori.eroare_default;
    err_def.imagine = path.join(obGlobal.obErori.cale_baza, err_def.imagine)
        ;
}

initErori();

function afisareEroare(res, _identificator, _titlu, _text, _imagine) {
    let eroare = obGlobal.obErori.info_erori.find(
        function (elem) {
            return elem.identificator == _identificator;
        })
    if (!eroare)
        eroare = obGlobal.obErori.eroare_default;
    res.render("pagini/eroare",
        {
            titlu: _titlu || eroare.titlu,
            text: _text || eroare.text,
            imagine: _imagine || eroare.imagine
        }
    )

}

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.fisier=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier )
        
    }
    console.log(obGlobal.obImagini)
}
initImagini();

// Veți declara un app.get() general pentru calea "/*", care tratează orice cerere de forma /pagina randând fișierul pagina.ejs (unde "pagina" e un nume generic și trebuie să funcționeze pentru orice string). Atenție, acest app.get() trebuie să fie ultimul în lista de app.get()-uri.  Dacă pagina cerută nu există, se va randa o pagină specială de eroare 404 (în modul descris mai jos). 
app.get('/*', (req, res) => {
    console.log(req.url);
    try {
        res.render('pagini' + req.url, (err, rezHtml) => {
            console.log(err);
            console.log(rezHtml);
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404)
                    console.log("Nu A gasit pagina:", req.url);
                }
            } else {
                res.send(rezHtml);
            }
        })
    }
    catch (err1) {
        if (err1.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404)
            console.log("Nu A gasit resursa:", req.url);
            return;
        }
        afisareEroare(res);
    }
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}
);
// afisati calea folderului index.js
// console.log("dirname: " + __dirname);
// // afisati calea folderului curent
// console.log("filename: " + __filename);
// // afisati calea folderului curent
// console.log("process cwd: " + process.cwd());

// Path: package.json
