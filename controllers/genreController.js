var Genre = require("../models/genre");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = function (req, res) {
  Genre.find({}, "name url")
    .sort([["name"]])
    .then((genreList) =>
      res.render("genre_list", {
        title: "Genre List",
        genre_list: genreList,
      })
    );
};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {
  Promise.all([
    Genre.findById(req.params.id).then((result) => {
      return { genre: result };
    }),
    Book.find({ genre: req.params.id }).then((results) => {
      return { genre_books: results };
    }),
  ]).then((results) => {
    if (results.genre === null) {
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }
    const data = Object.assign({}, ...results);
    res.render("genre_detail", { title: "Genre Detail", ...data });
  });
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res, next) {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findOne({ name: req.body.name }).then((found_genre) => {
        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
