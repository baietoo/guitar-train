DROP TYPE IF EXISTS categ_instrument;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_instrument AS ENUM( 'editie limitata', 'aniversara', 'signatura', 'comuna');
CREATE TYPE tipuri_produse AS ENUM('chitara', 'bass', 'claviatura', 'percutie', 'vocal', 'alte instrumente');


CREATE TABLE IF NOT EXISTS instrumente (
    id serial PRIMARY KEY,
    nume VARCHAR(50) UNIQUE NOT NULL,
    descriere TEXT,
    pret NUMERIC(8,2) NOT NULL,
    greutate NUMERIC(8,2) NOT NULL CHECK (greutate > 0),
    tip_produs tipuri_produse DEFAULT 'chitara',
    categorie categ_instrument DEFAULT 'comuna',
    imagine VARCHAR(300),
    data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO instrumente (nume,descriere,pret, greutate, tip_produs, categorie, imagine) VALUES 
('Chitara acustica', 'Chitara acustica cu corzi de otel', 500, 2.5, 'chitara', 'comuna', 'chitara-acustica.jpg'),

('Chitara electrica', 'Chitara electrica cu corzi de metal', 700, 3.5, 'chitara', 'comuna', 'chitara-electrica.jpg'),

('Bass', 'Bass cu 4 corzi', 800, 4.5, 'bass', 'comuna', 'bass.jpg'),

('Claviatura', 'Claviatura cu 88 de clape', 1000, 5.5, 'claviatura', 'comuna', 'claviatura.jpg'),

('Percutie', 'Set de tobe', 1500, 6.5, 'percutie', 'comuna', 'percutie.jpg'),

('Vocal', 'Microfon cu fir', 200, 0.5, 'vocal', 'comuna', 'microfon.jpg'),

('Alte instrumente', 'Instrumente muzicale diverse', 300, 1.5, 'alte instrumente', 'comuna', 'alte-instrumente.jpg');
