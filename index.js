const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

// flash messages 
const session = require('express-session');
const flash = require('connect-flash');

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");



// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));



// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// set up sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// set up flash
app.use(flash())

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// define  routes
const landingRoutes = require('./routes/landing')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/users')

// consult the routes in in landingRoutes object
async function main() {
   app.use('/', landingRoutes);
   app.use ('/products', productRoutes);
   app.use ('/users', userRoutes)
}



main();

app.listen(3000, () => {
  console.log("Server has started");
});

