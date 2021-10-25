const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');


// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");



// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));
app.use(express.static("images"));

// Route to display static src images
app.get("/static", (req, res) => {
  res.render("static");
});

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// set up sessions
app.use(session({
  'store': new FileStore(),
  'secret': 'keyboard cat',
  'resave': false,
  'saveUninitialized': true
}))

// set up flash
app.use(flash())

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// enable CSRF & unject csfr token to all hbs files
app.use(csrf());

app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
  next();
})

// share user data with hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      next()
  }
});




// define  routes
const landingRoutes = require('./routes/landing')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary.js')


// consult the routes in in landingRoutes object
async function main() {
   app.use('/', landingRoutes);
   app.use ('/products', productRoutes);
   app.use ('/users', userRoutes);
   app.use('/cloudinary', cloudinaryRoutes);
}



main();

app.listen(3000, () => {
  console.log("Server has started");
});

