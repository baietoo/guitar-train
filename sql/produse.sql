DROP TYPE IF EXISTS categ_instrument;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_instrument AS ENUM( 'chitara', 'bass', 'tobe');
CREATE TYPE tipuri_produse AS ENUM('acustic', 'electric', 'electroacustic');


CREATE TABLE IF NOT EXISTS instrumente (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate>=0),   
   tip_produs tipuri_produse DEFAULT 'acustic',
   corzi INT NOT NULL CHECK (corzi>=0),
   categorie categ_instrument DEFAULT 'chitara',
   materiale VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   pt_stangaci BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into instrumente (nume,descriere,pret, greutate, corzi, tip_produs, categorie, materiale, pt_stangaci, imagine) VALUES 
('Millenium', 'Tobe profesioniste', 10000 , 80, 0, 'acustic', 'tobe', '{"lemn fag", "membrana cauciuc"}', False,'millenium-tobe.jpg'),
('Schecter Damien', 'Bass electric', 3000 , 5, 4, 'electric', 'bass', '{"lemn de mahon"}', False, 'schecter-bass.jpg');