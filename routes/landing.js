const express = require('express')
const router = express.Router(); 

router.get('/', (req,res)=>{
    res.render("landing/welcome");
    // res.render("products/index");
})

router.get('/about-us', (req,res)=>{
    res.render("landing/about-us")
})

router.get('/tradein', (req,res)=>{
    res.render("landing/tradein")
})

module.exports = router;