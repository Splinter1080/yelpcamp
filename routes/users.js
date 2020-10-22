const express = require('express');
const router = express.Router() ;
const passport  = require('passport'); 
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register' , (req, res) => {
    res.render('users/register') ; 
});

router.post('/register', catchAsync(async (req, res, next) => {

    try{
        const { email , username, password} = req.body ;
        const user = new User({ email , username });
        const registeredUser = await User.register(user, password) ; //passport is handling all the stuff here!
        req.login(registeredUser , err=> {
            if(err) next(err) ; 
            req.flash('success' ,'Welcome Welcome Welcome to YelpCamp!' );
            res.redirect('/campgrounds');
        })

    } catch(e){ 
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login' , (req, res) => {
    res.render('users/login') ; 
})

router.post('/login' , passport.authenticate('local' , {failureFlash: true , failureRedirect: '/login' }) , (req, res) => {
    req.flash('success' , 'Welcome Back !') ; 
    const redirectUrl = req.session.returnTo || '/campgrounds' ; //returnTo = the current path u were in before login
    delete req.session.returnTo ; 
    res.redirect(redirectUrl) ; 
}); 

router.get('/logout' , (req, res) => {
    req.logout() ; //passport function
    req.flash('success' , 'B-Bye!'); 
    res.redirect('/campgrounds') ; 
})


module.exports = router;