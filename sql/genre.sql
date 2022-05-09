CREATE SEQUENCE genre_seq;

CREATE TABLE genre (
  id int NOT NULL PRIMARY KEY,
  name varchar(100),
  url varchar(100) NULL
);


INSERT INTO genre VALUES(nextval('genre_seq'), 'Science Fiction', concat('/catalog/genre/', currval('genre_seq')));

INSERT INTO genre VALUES(nextval('genre_seq'), 'Fantasy', concat('/catalog/genre/', currval('genre_seq')));

INSERT INTO genre VALUES(nextval('genre_seq'), 'French Poetry', concat('/catalog/genre/', currval('genre_seq')));
