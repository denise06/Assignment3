const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');
const bodyParser = require('body-parser');

// setup wax-on
wax.on(hbs.handlebars);

// Other hbs helpers
wax.setLayoutPath("./views/layouts");

//Other HBS helpers
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('parse',function(String){
  return String.replace(/{/g,'').replace(/}/g,'').replace(/\[/g,'').replace(/\]/g,'')
  .replace(/"/g,'').split(',')
});

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

// Define sessions
app.use(session({
  'store': new FileStore(),
  'secret': process.env.SESSION_SECRET_KEY,
  'resave': false,
  'saveUninitialized': true
}))

// Define flash
app.use(flash())

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// enable CSRF & unject csfr token to all hbs files
// app.use(csrf());
const csurfInstance = csrf();
app.use(function(req,res,next){
  // we are exlcuding csrf for /checkout/process_payment and any routes which path 
  // begins with '/api/'
  if (req.url == "/checkout/process_payment" || req.url.slice(0,5) == '/api/') {
      return next();
  } else {
      // manually called the csurfInstance to 
      // check the request
      csurfInstance(req,res,next)
  }
})

// middleware to inject the csrf token into all hbs files
app.use(function(req, res, next){
  if (req.csrfToken) {
      res.locals.csrfToken = req.csrfToken();
  }    
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
const cartRoutes = require('./routes/shoppingCart')
const checkoutRoutes = require('./routes/checkout')
const orderRoutes = require('./routes/orders')

// consult the routes in in landingRoutes object
async function main() {
   app.use('/', landingRoutes);
   app.use ('/products', productRoutes);
   app.use ('/users', userRoutes);
   app.use('/cloudinary', cloudinaryRoutes);
   app.use('/shoppingCart', cartRoutes);
   app.use('/checkout', checkoutRoutes);
   app.use('/orders', orderRoutes);

}

main();

app.listen(3000, () => {
  console.log("Server has started");
});

