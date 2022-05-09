
CREATE TABLE author (
  id SERIAL,
  first_name varchar(100),
  family_name varchar(100),
  date_of_birth date,
  date_of_death date NULL
);

INSERT INTO author VALUES(DEFAULT, 'Patrick', 'Rothfuss', '1973-06-06');
INSERT INTO author VALUES(DEFAULT, 'Ben', 'Bova', '1932-11-8');
INSERT INTO author VALUES(DEFAULT, 'Isaac', 'Asimov', '1920-01-02', '1992-04-06');
INSERT INTO author VALUES(DEFAULT, 'Bob', 'Billings', '1960-05-01');
INSERT INTO author VALUES(DEFAULT, 'Jim', 'Jones', '1971-12-16'); 
