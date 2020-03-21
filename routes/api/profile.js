const express = require('express');
const auth = require('../../midlware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();

// @route Get api/profile/me
// @desc Get current user profile
// @acess Private
router.get ('/me',auth,async (req,res)=>{
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({
                msg : 'User profile not found '
            })
        }
        
    } catch (error) {
        Console.error(error.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;