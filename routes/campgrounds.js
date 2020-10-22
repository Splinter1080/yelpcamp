const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn , validateCampground, isAuthor} = require('../middleware'); 
const Campground = require('../models/campground');



router.route('/')
.get( catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))
.post(isLoggedIn , validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id ; 
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.route('/new')
.get( isLoggedIn , (req, res) => {
    res.render('campgrounds/new');
});

router.route('/:id')
.get(catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    .populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.render('campgrounds/show', { campground });
}))
.put(isLoggedIn , isAuthor , validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))
.delete(isLoggedIn , isAuthor ,  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

router.route('/:id/edit')
.get( isLoggedIn , isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));



module.exports = router;