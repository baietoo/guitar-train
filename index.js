// se va crea obiect server express care va asculta 8080

const express = require('express');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('resurse', './resurse');
app.use(express.static(__dirname + '/resurse'));
//app.get să se poată accesa atât cu localhost:8080 cât și cu localhost:8080/index,  localhost:8080/home. Realizați acest lucru folosinf un vector în apelul app.get() care transmite pagina principală
app.get(['/', '/index', '/home'], (req, res) => {
    res.render('index');
    });
// Veți declara un app.get() general pentru calea "/*", care tratează orice cerere de forma /pagina randând fișierul pagina.ejs (unde "pagina" e un nume generic și trebuie să funcționeze pentru orice string). Atenție, acest app.get() trebuie să fie ultimul în lista de app.get()-uri.  Dacă pagina cerută nu există, se va randa o pagină specială de eroare 404 (în modul descris mai jos). 
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
    }
);
// Se va seta un view engine pentru a folosi ejs (app.set('view engine', 'ejs'))
// render ejs template
app.get('/pagina', (req, res) => {
    res.render('pagina');
    }
);

// set views folder


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    }
);
// afisati calea folderului index.js
console.log(__dirname);
// afisati calea folderului curent
console.log(__filename);
// afisati calea folderului curent
console.log(process.cwd());

// Path: package.json
