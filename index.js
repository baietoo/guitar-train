// se va crea obiect server express care va asculta 8080
const fs = require('fs');
const { Client } = require('pg');
const sass = require('sass');
const sharp = require('sharp');
const path = require('path');
const express = require('express');
const app = express();
const port = 8080;

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
    optiuniMeniu: null
}

vect_foldere = ["temp", "backup"]
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
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
    res.render('pagini/index', { ip: req.ip, imagini: obGlobal.obImagini.imagini });
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

function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;

    let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu = path.join(__dirname, obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini) {
        [numeFis, ext] = imag.fisier.split(".");
        let caleFisAbs = path.join(caleAbs, imag.fisier);
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu = path.join("/", obGlobal.obImagini.cale_galerie, "mediu", numeFis + ".webp")
        imag.fisier = path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier)

    }
    // console.log(obGlobal.obImagini)
}
initImagini();



// Functia de compilare SCSS
function compileazaScss(caleScss, caleCss) {
    console.log("cale:", caleCss);
    if (!caleCss) {
        let numeFisExt = path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0]; // "a.scss" -> ["a","scss"]
        caleCss = numeFis + ".css";
    }
    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss);
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss);

    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true });
    }

    // la acest punct avem cai absolute în caleScss și caleCss
    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss)) {
        // Adăugăm timestamp în numele fișierului de backup
        let timestamp = Date.now();
        let numeFisCssBackup = numeFisCss.replace(/\.css$/, `_${timestamp}.css`);
        fs.copyFileSync(caleCss, path.join(caleBackup, numeFisCssBackup));
    }

    let rez = sass.compile(caleScss, { "sourceMap": true });
    fs.writeFileSync(caleCss, rez.css);

    console.log("Compilare SCSS reușită:", caleCss);
}

// Functia de curatare a fisierelor vechi din backup
function curataBackup(folderBackup, T) {
    const currentTime = Date.now();
    const TMilliseconds = T * 60 * 1000; // Convertim T in milisecunde

    fs.readdir(folderBackup, (err, files) => {
        if (err) {
            console.error("Eroare la citirea folderului de backup:", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderBackup, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error("Eroare la obtinerea informatiilor despre fisier:", err);
                    return;
                }

                const fileAge = currentTime - stats.mtimeMs;
                if (fileAge > TMilliseconds) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error("Eroare la stergerea fisierului:", err);
                        } else {
                            console.log("Fisier sters:", filePath);
                        }
                    });
                }
            });
        });
    });
}

// Setam un interval pentru a verifica si curata periodic folderul de backup
const folderBackup = path.join(obGlobal.folderBackup, "resurse/css");
const T = 1; // Intervalul T in minute (de exemplu, 60 minute)

setInterval(() => {
    curataBackup(folderBackup, T);
}, T * 60 * 1000); // Verifica la fiecare T minute

//compileazaScss("a.scss");
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    console.log(eveniment, numeFis);
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
});


var client = new Client({
    database: "tw",
    user: "postgres",
    password: "postgres",
    host: "localhost", port: 5433
});

client.connect();


app.get("/produse", function (req, res) {
    console.log(req.query)
    console.log("DSADSADASDAS");
    var conditieQuery = "";
    if (req.query.tip) {
        conditieQuery = ` where tip_produs='${req.query.tip}'`
    }
    client.query("select * from unnest(enum_range(null::categ_instrument))", function (err, rezOptiuni) {

        client.query(`select * from instrumente ${conditieQuery}`, function (err, rez) {
            if (err) {
                console.log(err);
                afisareEroare(res, 2);
            }
            else {
                res.render("pagini/produse", { produse: rez.rows, optiuni: rezOptiuni.rows })
            }
        })
    });
})

app.get("/produs/:id", function (req, res) {
    client.query(`SELECT * FROM instrumente WHERE id=${req.params.id}`, function (err, rez) {
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
        } else {
            const produs = rez.rows[0];
            const categorie = produs.categorie;
            
            // Query to get similar products
            client.query(`SELECT * FROM instrumente WHERE categorie='${categorie}' AND id != ${req.params.id} LIMIT 5`, function (err, similarRez) {
                if (err) {
                    console.log(err);
                    afisareEroare(res, 2);
                } else {
                    res.render("pagini/produs", { prod: produs, similarProducts: similarRez.rows });
                }
            });
        }
    });
});




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
