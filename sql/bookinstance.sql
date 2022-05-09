CREATE SEQUENCE bookinstance_seq;

create type bookinstance_status as enum ('available', 'maintenance', 'loaned');

CREATE TABLE bookinstance (
  id int NOT NULL PRIMARY KEY,
  imprint varchar(100),
  url varchar(200),
  status bookinstance_status,
  due_back date,
  book int, 
  foreign key(book) references book(id)
);

INSERT INTO bookinstance VALUES(
nextval('bookinstance_seq'),
'London Gollancz, 2014.',
concat('/catalog/bookinstance/', currval('bookinstance_seq')),
'available',
null,
(select id from book where title = 'The Name of the Wind (The Kingkiller Chronicle, #1)')
);

INSERT INTO bookinstance VALUES(
nextval('bookinstance_seq'),
'Gollancz, 2011.',
concat('/catalog/bookinstance/', currval('bookinstance_seq')),
'loaned',
null,
(select id from book where title = E'The Wise Man\'s Fear (The Kingkiller Chronicle, #2)')
);

INSERT INTO bookinstance VALUES(
nextval('bookinstance_seq'),
'New York Tom Doherty Associates, 2016.',
concat('/catalog/bookinstance/', currval('bookinstance_seq')),
'available',
null,
(select id from book where title = 'Apes and Angels')
);


INSERT INTO bookinstance VALUES(
nextval('bookinstance_seq'),
'New York Tom Doherty Associates, 2016.',
concat('/catalog/bookinstance/', currval('bookinstance_seq')),
'available',
null,
(select id from book where title = 'Apes and Angels')
);

INSERT INTO bookinstance VALUES(
nextval('bookinstance_seq'),
'New York Tom Doherty Associates, 2016.',
concat('/catalog/bookinstance/', currval('bookinstance_seq')),
'available',
null,
(select id from book where title = 'Apes and Angels')
);

INSERT INTO bookinstance VALUES(
nextval('bookinstance_seq'),
'New York Tom Doherty Associates, 2016.',
concat('/catalog/bookinstance/', currval('bookinstance_seq')),
'available',
null,
(select id from book where title = 'Apes and Angels')
);

