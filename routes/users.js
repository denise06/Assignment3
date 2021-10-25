const express = require("express");
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


// import in the User model
const { User } = require('../models');

const { createRegistrationForm, createLoginForm, bootstrapField } = require('../forms');

router.get('/register', (req,res)=>{
    // display the registration form
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        success: async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email
            });
            await user.save();
            req.flash("success_messages", "User signed up successfully!");
            res.redirect('/users/login')
        },
        'error': (form) => {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// login page
router.get('/login', (req,res)=>{
    const loginForm = createLoginForm();
    res.render('users/login',{
        'form': loginForm.toHTML(bootstrapField)
    })

})

// process login
router.post('/login', (req, res) => {

    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async (form) => {
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false
            })

            // if the user  not found
            if (!user) {
                req.flash('error_messages', "The details you've provided is not working, please try again.");
                res.redirect('/users/login')
            }

            // check user password
            if (user.get('password') == getHashedPassword(form.data.password)) {
                // if it matches, store the user in the client session
                req.session.user = {
                    'id': user.get('id'),
                    'username': user.get('username'),
                    'email': user.get('email')
                }
                req.flash('success_messages', "Welcome back, " + user.get('username'));
                res.redirect('/users/profile')
                
            } else {
                req.flash('error_messages', "The details you've provided is not working, please try again.");
                res.redirect('/users/login')
            }

        },
        'error': (form) =>{
            res.render('users/login',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// display user profile after successful login, else, back to login page
router.get('/profile', (req, res) => {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'You do not have permission to view this page');
        res.redirect('/users/login');
    } else {
        res.render('users/profile',{
            'user': user
        })
    }
})

// Users to log out
router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "Goodbye");
    res.redirect('/users/login');
})


module.exports = router;

