const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const existedusername = users.filter((user) => user.username === username);
    if (existedusername.length <=0) {
      users.push({'username':username, 'password':password});
      return res.status(200).send('User registered with success');
    } else {
      return res.status(403).send('User already exists!')
    }
  } else {
    return res.status(403).send('Provide you credentials Please!')
  }

});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
    return await res.status(300).send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => { 
  const isbn = req.params.isbn;
  let myPromive = new Promise((resolve, reject) => {
    resolve(res.status(300).send(books[isbn]))
  })
 });
  
// Get book details based on author // not yet wworkinggngjdnsdjgng
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  for ( const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (book.author === author) {
        res.status(200).json({AuthorBooks: book});
        return
      }
    }
  }
  res.status(403).send('No book found for author: '+author)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (book.title === title) {
        res.status(200).json({BookTitle: book});
        return
      }
    }
  }
  return res.status(300).json({message: "No book found with title: "+title});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).send(books[isbn].reviews);
});

module.exports.general = public_users;
