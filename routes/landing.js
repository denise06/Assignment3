const express = require('express')
const router = express.Router(); 

router.get('/', (req,res)=>{
    res.render("landing/welcome");
})

router.get('/about-us', (req,res)=>{
    res.send("landing/about-us")
})

router.get('/contact-us', (req,res)=>{
    res.send("landing/contact-us")
})

// export out the router object so that other javascript files
// can use it
module.exports = router;