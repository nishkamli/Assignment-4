const mongoose = require('mongoose');
 
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  img: String,  // Remove required validation
  isbn: String,      // Remove required validation
  inventory: Number,
  category: String,
});
const Book = mongoose.model('Books', BookSchema);
 
module.exports = Book;
