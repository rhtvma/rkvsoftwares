// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const _ObjectId = mongoose.Types.ObjectId;
// define the book model
let Books = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Books.find({}, (err, books) => {
    if (err) {
      return res.render('errors/500', {
        title: 'Book fetch Error',
        error: err || 'Issue while fetching records'
      });
    }
    else {
      return res.render('books/index', {
        title: 'Books', books: books
      });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  return res.render('books/details', {
    title: 'Books Add',
    type: 'add',
    books: {}
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  var book = {
    Title: req.body.title,
    Description: req.body.description,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre
  };

  Books.create(book, (err, hero) => {
    if (err) {
      return res.render('errors/500', {
        title: 'Book Add Error',
        error: err
      });
    }
    return res.redirect('/books');
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  if (_ObjectId.isValid(id)) {
    Books.findById(id, (err, books) => {
      if (err) {
        return res.render('errors/500', {
          title: 'Book Edit Error',
          error: err
        });
      }
      else {
        return res.render('books/details', {
          title: 'Books Details',
          type: 'edit',
          books: books
        });
      }
    });
  } else {
    return res.render('errors/500', {
      title: 'Book update error',
      error: "provide correct key"
    });
  }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', async (req, res, next) => {
  const id = req.params.id;

  const book = {
    Title: req.body.title,
    Description: req.body.description,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre
  };

  if (_ObjectId.isValid(id)) {
    Books.findOneAndUpdate({ _id: id }, { $set: book }).then((docs) => {
      if (docs) {
        res.redirect('/books');
      } else {
        return res.render('errors/500', {
          title: 'Book deletetion error',
          error: "Nothing to update"
        });
      }
    }).catch((err) => {
      return res.render('errors/500', {
        title: 'Book deletetion error',
        error: err
      });
    });
  } else {
    return res.render('errors/500', {
      title: 'Book deletetion error',
      error: "Provide correct key"
    });
  }
});

// GET - process the delete by user id
router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  if (_ObjectId.isValid(id)) {
    Books.findByIdAndDelete({ _id: id })
      .then((docs) => {
        if (docs) {
          res.redirect('/books');
        } else {
          return res.render('errors/500', {
            title: 'Book deletetion error',
            error: 'Book not found'
          });
        }
      }).catch((err) => {
        return res.render('errors/500', {
          title: 'Book deletetion error',
          error: err
        });
      });
  } else {
    return res.render('errors/500', {
      title: 'Book Delete Error',
      error: "Provide correct key"
    });
  }
});


module.exports = router;
