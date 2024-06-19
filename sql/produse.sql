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
('Schecter omen 6', 'chitara electrica', 2000 , 7, 6, 'electric', 'chitara', '{"mahon","lemn trandafir"}', False, 'schecter-omen-6.jpg'),

('Takamine', 'Chitara acustica', 4000 , 5, 6, 'acustic', 'chitara', '{"lemn de tei"}', False, 'takamine-acustic-6.jpg'),

('Pearl', 'Tobe profesioniste', 10000 , 80, 0, 'acustic', 'tobe', '{"lemn stejar", "membrana cauciuc"}', False,'pearl-tobe.jpg'),

('Ibanez', 'Bass electric', 3000 , 5, 4, 'electric', 'bass', '{"lemn de tei"}', False, 'ibanez-bass.jpg'),
   
('Yamaha', 'Chitara electroacustica', 5000 , 6, 6, 'electroacustic', 'chitara', '{"lemn de tei"}', False, 'yamaha-electroacustic.jpg');


;