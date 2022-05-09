//@ts-check
var Book = require("../models/book");
var Author = require("../models/author");
var Genre = require("../models/genre");
var BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");

exports.index = function (req, res) {
  Promise.all([
    Book.countDocuments().then((count) => {
      return { book_count: count };
    }),
    BookInstance.countDocuments().then((count) => {
      return { book_instance_count: count };
    }),
    BookInstance.countDocuments({ status: "Available" }).then((count) => {
      return { book_instance_available_count: count };
    }),
    Author.countDocuments().then((count) => {
      return { author_count: count };
    }),
    Genre.countDocuments().then((count) => {
      return { genre_count: count };
    }),
  ]).then((results) => {
    const data = Object.assign({}, ...results);
    res.render("index", {
      title: "Local Library Home",
      data: data,
    });
  });
};

// Display list of all books.
exports.book_list = function (req, res) {
  Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .then((book_list) =>
      res.render("book_list", { title: "Book List", book_list: book_list })
    );
};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {
  Promise.all([
    Book.findById(req.params.id)
      .populate("author")
      .populate("genre")
      .then((result) => {
        return { book: result };
      }),
    BookInstance.find({ book: req.params.id }).then((result) => {
      return { book_instance: result };
    }),
  ]).then((results) => {
    const data = Object.assign({}, ...results);
    if (data.book == null) {
      // No results.
      var err = new Error("Book not found");
      err.status = 404;
      return next(err);
    }
    res.render("book_detail", {
      title: data.book.title,
      book: data.book,
      book_instances: data.book_instance,
    });
  });
};

// Display book create form on GET.
exports.book_create_get = function (req, res, next) {
  Promise.all([Author.find(), Genre.find()])
    .then((results) => {
      const [authors, genres] = results;
      res.render("book_form", {
        title: "Create Book",
        authors: authors,
        genres: genres,
      });
    })
    .catch((err) => next(err));
};

// Handle book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      Promise.all([Author.find(), Genre.find()])
        .then((results) => {
          const [authors, genres] = results;
          for (let i = 0; i < genres.length; i++) {
            if (book.genre.indexOf(genres[i]._id) > -1) {
              genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Create Book",
            authors: authors,
            genres: genres,
            book: book,
            errors: errors.array(),
          });
          return;
        })
        .catch((err) => next(err));
    } else {
      book
        .save()
        .then(() => res.redirect(book.url))
        .catch((err) => next(err));
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = function (req, res, next) {
  Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre"),
    Author.find(),
    Genre.find(),
  ])
    .then((results) => {
      const [book, authors, genres] = results;
      for (var all_g_iter = 0; all_g_iter < genres.length; all_g_iter++) {
        for (
          var book_g_iter = 0;
          book_g_iter < book.genre.length;
          book_g_iter++
        ) {
          if (
            genres[all_g_iter]._id.toString() ===
            book.genre[book_g_iter]._id.toString()
          ) {
            genres[all_g_iter].checked = "true";
          }
        }
      }
      res.render("book_form", {
        title: "Update Book",
        authors: authors,
        genres: genres,
        book: book,
      });
    })
    .catch((e) => next(e));
};

// Handle book update on POST.
exports.book_update_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      Promise.all([Author.find(), Genre.find()]).then((results) => {
        const [authors, genres] = results;
        // Mark our selected genres as checked.
        for (let i = 0; i < genres.length; i++) {
          if (book.genre.indexOf(genres[i]._id) > -1) {
            genres[i].checked = "true";
          }
        }
        res.render("book_form", {
          title: "Update Book",
          authors: authors,
          genres: genres,
          book: book,
          errors: errors.array(),
        });

        return;
      });
    } else {
      // Data from form is valid. Update the record.
      Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect(thebook.url);
      });
    }
  },
];
