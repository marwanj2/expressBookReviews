const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const usernameValid = users.filter((user) => {
    return user.username === username })
  if (usernameValid.length>0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const userAuth = users.filter((user) => {
    return (user.username === username && user.password ===password);
  })
  if (userAuth.length>0) {
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(user => user.username === username);

  if (!username || !password) {
    return res.status(404).json({message:'Invalid username or password'});
  }

  //user authenticated, generate jwt token
  const token = jwt.sign( 
    { username: user.username }, 'access', {expiresIn: 60*60} )

    return res.status(200).send("User successfully logged in + token "+token);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
    const review = req.query.review;
    const username = req.username;

    // Check if there is already a review for this book by this user
    if (books[ISBN].review && books[ISBN].review[username]) {
        // If yes, modify the existing review
        books[ISBN].review[username] = review;
        res.send('Review modified successfully');
    } else {
        // If not, add a new review
        if (!books[ISBN].review) {
            books[ISBN].review = {};
        }
        books[ISBN].review[username] = review;
        res.send('Review added successfully');
    }
});

// delete revuiew
regd_users.delete('/auth/review/:isbn', (req,res) => {
  const isbn = req.params.isbn;
  const username = req.username;

  if (books[isbn].review){
    if (books[isbn].review[username]) {
      delete books[isbn].review;
      res.send('Review deleted with success')
    } else {
      res.status(404).send('Review not found for the user')
    }
  } else {
    res.status(404).send('No reviews found for the book')
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
