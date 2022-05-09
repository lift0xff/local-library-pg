CREATE SEQUENCE book_seq;

CREATE TABLE book (
  id int NOT NULL PRIMARY KEY,
  title varchar(200),
  url varchar(200),
  isbn varchar(200),
  author integer,
  genre integer,
  summary varchar(1000),
  foreign key(author) references author(id),
  foreign key(genre) references genre(id)
);

INSERT INTO book VALUES(nextval('book_seq'),
'The Name of the Wind (The Kingkiller Chronicle, #1)',
concat('/catalog/book/', currval('book_seq')),
'9781473211896',
(select id from author where family_name = 'Rothfuss'),
(select id from genre where name = 'Fantasy'),
'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.');


INSERT INTO book VALUES(nextval('book_seq'),
E'The Wise Man\'s Fear (The Kingkiller Chronicle, #2)',
concat('/catalog/book/', currval('book_seq')),
'9788401352836',
(select id from author where family_name = 'Rothfuss'),
(select id from genre where name = 'Fantasy'),
'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.');

INSERT INTO book VALUES(nextval('book_seq'),
E'The Slow Regard of Silent Things (Kingkiller Chronicle)',
concat('/catalog/book/', currval('book_seq')),
'9780756411336',
(select id from author where family_name = 'Rothfuss'),
(select id from genre where name = 'Fantasy'),
'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.');

INSERT INTO book VALUES(nextval('book_seq'),
E'Apes and Angels',
concat('/catalog/book/', currval('book_seq')),
'9780765379528',
(select id from author where family_name = 'Bova'),
(select id from genre where name = 'Science Fiction'),
'Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...');

INSERT INTO book VALUES(nextval('book_seq'),
E'Death Wave',
concat('/catalog/book/', currval('book_seq')),
'9780765379504',
(select id from author where family_name = 'Bova'),
(select id from genre where name = 'Science Fiction'),
E'In Ben Bova\'s previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...');

INSERT INTO book VALUES(nextval('book_seq'),
E'Test Book 1',
concat('/catalog/book/', currval('book_seq')),
'ISBN111111',
(select id from author where family_name = 'Jones'),
(select id from genre where name = 'French Poetry'),
E'Test Summary 1');

INSERT INTO book VALUES(nextval('book_seq'),
E'Test Book 2',
concat('/catalog/book/', currval('book_seq')),
'ISBN222222',
(select id from author where family_name = 'Asimov'),
(select id from genre where name = 'Science Fiction'),
E'Test Summary 2');

