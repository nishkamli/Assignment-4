const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Book = require('../models/book'); // Adjust the path as needed

// Get all books with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const books = await Book.find().limit(limit).skip(startIndex).lean().exec();
       res.render('alldata', { books, page, limit });
        //res.json(books);
    } catch (err) {
        console.error("Error fetching books: ", err);
        res.status(500).send('Error fetching books');
    }
});

// Render form to add a new book
router.get('/addData', async (req, res) => {
    res.render('addBook');
});

router.post('/books', async (req, res) => {
    try {
        const newBook = new Book({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title || '',
            author: req.body.author || '',
            price: req.body.price || 0,
            imageUrl: req.body.imageUrl || 'http://ecx.images-amazon.com/images/I/41kSLEoswsL.jpg',
            isbn: req.body.isbn || '',
            inventory: req.body.inventory || 0,
            category: req.body.category || 'Medical Books',
        });

        await newBook.save();
        res.json(newBook);
        //res.redirect('/alldata');
    } catch (err) {
        console.error("Error saving new book: ", err);
        res.status(500).send('Failed to add new book');
    }
});


// Render form for book search
router.get('/UpdateData', async (req, res) => {
    res.render('searchBook');
});

// Search books
router.get('/searchBooks', async (req, res) => {
    const searchQuery = req.query.search;
    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { author: { $regex: searchQuery, $options: "i" } }
            ]
        }).lean();
        res.render('bookSearchResults', { books, searchQuery });
    } catch (err) {
        console.error("Error searching books: ", err);
        res.status(500).send('Error searching books');
    }
});

router.post('/books', async (req, res) => {
    try {
        const newBook = new Book({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title || '',
            author: req.body.author || '',
            price: req.body.price || 0,
            imageUrl: req.body.imageUrl || 'http://ecx.images-amazon.com/images/I/41kSLEoswsL.jpg',
            isbn: req.body.isbn ,
            inventory: req.body.inventory || 0,
            category: req.body.category || 'Medical Books',
        });

        await newBook.save();
        res.json(newBook);
        //res.redirect('/alldata');
    } catch (err) {
        console.error("Error saving new book: ", err);
        res.status(500).send('Failed to add new book');
    }
});

// Get a single book by ISBN
router.get('/book/:ISBN', async (req, res) => {
    const isbn = req.params.ISBN;

    try {
        const book = await Book.findOne({ ISBN: isbn });
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Update a book by ISBN (PUT)
router.put('/book/:ISBN', async (req, res) => {
    const isbn = req.params.ISBN;
    const updateData = req.body;

    try {
        const updatedBook = await Book.findOneAndUpdate({ ISBN: isbn }, updateData, { new: true });
        if (!updatedBook) {
            return res.status(404).send('Book not found');
        }
        res.json(updatedBook);
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).send(err.message);
    }
});

// Delete a book by ISBN
router.delete('/book/:ISBN', async (req, res) => {
    const isbn = req.params.ISBN;

    try {
        const deletedBook = await Book.findOneAndDelete({ ISBN: isbn });
        if (!deletedBook) {
            return res.status(404).send('Book not found');
        }
        res.send('Book deleted successfully');
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
