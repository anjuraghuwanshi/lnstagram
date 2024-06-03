const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../requireLogin'); // Middleware to ensure the user is logged in
const USER = mongoose.model('USER');
const POST = mongoose.model('POST'); // Assuming your post model is named 'POST'

// Route to get another user's profile by their ID or username
router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        // Find the user by ID or username
        const user = await USER.findById(req.params.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find posts made by the user
        const posts = await POST.find({ postedBy: req.params.id })
            .populate('postedBy', '_id name username')
            .populate('comments.postedBy', '_id name username')
            .sort('-createdAt');
        res.json({ user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

//to follow user
router.put('/follow', requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(
            req.body.followId,
            { $addToSet: { followers: req.user._id } },
            { new: true }
        );

        if (!result) {
            return res.status(422).json({ error: 'User not found' });
        }

        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { following: req.body.followId } },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


//to unfollow user
router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        if (!result) {
            return res.status(422).json({ error: 'User not found' });
        }

        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


// to upload profile pic
router.put("/uploadprofilepic",requireLogin,async(req,res)=>{
    try{
 const user = await USER.findByIdAndUpdate(req.user._id,{
    $set:{photo:req.body.pic}
},{
    new: true
}).exec();

res.json(user);
    }
    catch(err){
    return res.status(422).json({error:err})
    }
})


module.exports = router;
