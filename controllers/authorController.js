var Author = require("../models/author");
var Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// Display list of all Authors.
exports.author_list = function (req, res, next) {
  Author.find()
    .sort([["family_name", "ascending"]])
    .then((author_list) =>
      res.render("author_list", {
        title: "Author List",
        author_list: author_list,
      })
    )
    .catch((err) => next(err));
};

// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {
  Author.findById(req.params.id)
    .then((author) => {
      if (author === null) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      return author;
    })
    .then((author) => {
      return new Promise((resolve, reject) => {
        Book.find({ author: author.id })
          .populate("genre")
          .then((books) => {
            author.books = books;

            author.genres = Array.from(
              new Set(books.flatMap((b) => b.genre).map((g) => g.name))
            );

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

      // Create an Author object with escaped and trimmed data.
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  },
];

// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {
  Promise.all([
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }),
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
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }),
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
      Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/catalog/authors");
      });
    }
  });
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Author update POST");
};
