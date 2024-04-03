// se va crea obiect server express care va asculta 8080

const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

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
