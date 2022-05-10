const Author = require("../models/author");
const sql = require("../db.js");
//var Author = require("../models/author");
// var Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// Display list of all Authors.
exports.author_list = function (req, res, next) {
  sql`
    select * from author order by family_name;
  `
    .then((author_list) => {
      res.render("author_list", {
        title: "Author List",
        author_list: author_list,
      });
    })
    .catch((err) => next(err));
};

// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {
  sql`
  select * from author where id = ${req.params.id};
  `
    .then((author) => {
      if (author.length === 0) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      return author[0];
    })
    .then((author) => {
      return new Promise((resolve, reject) => {
        sql`
        select book.id, book.title, book.url, book.isbn, genre.name as genre,
        book.summary from book
        inner join genre on book.genre = genre.id 
        where author = ${author.id}
        `
          .then((books) => {
            author.books = books;
            author.genres = books.map((b) => b.genre);
            author.url = `/catalog/author/${author.id}`;
            resolve(author);
          })
          .catch((err) => next(err));
      });
    })
    .then((author) => {
      res.render("author_detail", { author: author });
    });
};

// Display Author create form on GET.
exports.author_create_get = function (req, res) {
  res.render("author_form", { title: "Create Author" });
};

// Handle Author create on POST.
exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const author = Object.assign({}, req.body);
      sql`
      insert into author VALUES(DEFAULT, 
        ${req.body.first_name},
        ${req.body.family_name}, 
        ${req.body.date_of_birth},
        ${req.body.date_of_death || null}
        ) returning id
      `
        .then(([author]) => res.redirect(`/catalog/author/${author.id}`))
        .catch((e) => next(e));
    }
  },
];

// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {
  Promise.all([
    sql`
    select * from author where id = ${req.params.id};
    `,
    `select * from book where author = ${req.params.id}`,
  ])
    .then((results) => {
      const [author, books] = results;
      author === null && res.redirect("/catalog/authors");
      res.render("author_delete", {
        title: "Delete Author",
        author: author,
        author_books: books,
      });
    })
    .catch((e) => next(e));
};

// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {
  Promise.all([
    sql`select * from author where id = ${req.params.id}`,
    sql`select * from book where author = ${req.params.id}`,
  ]).then((results) => {
    const [author, books] = results;

    if (books.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render("author_delete", {
        title: "Delete Author",
        author: author,
        author_books: books,
      });
      return;
    } else {
      sql`delete from author where id = ${req.body.authorid}`
        .then(() => res.redirect("/catalog/authors"))
        .catch((err) => next(err));
    }
  });
};

// Display Author update form on GET.
exports.author_update_get = function (req, res, next) {
  sql`
    select * from author where id = ${req.params.id};
    `
    .then((results) => {
      const [author] = results;
      author.url = `/catalog/author/${author.id}`;
      author == null && res.redirect("/catalog/authors");
      const viewAuthor = Author.toView(author);
      console.log(viewAuthor);
      res.render("author_form", {
        title: "Update Author",
        author: viewAuthor,
      });
    })
    .catch((e) => next(e));
};

// Handle Author update on POST.
exports.author_update_post = [
  body("id")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric(),
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      sql`
      update author set ${sql(
        req.body,
        ...Object.keys(req.body).filter((k) => req.body[k] != null)
      )}
      where id = ${req.body.id}
      returning id
      `
        .then(([author]) => res.redirect(`/catalog/author/${author.id}`))
        .catch((e) => next(e));
    }
  },
];
