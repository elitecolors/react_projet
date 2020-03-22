const express = require('express');
const router = express.Router();
const { check,validationResult} = require ('express-validator');
const auth = require ('../../midlware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route Get api/posts
// @desc Create post 
// @acess private
router.post ('/',[auth,[
    check('text','text required').not().isEmpty()
]],async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        console.log()
        const user = await User.findById(req.user.id).select('-password');
      
        const newPost=   new Post({
            text : req.body.text,
            name : req.body.name,
            avatar : user.avatar,
            user : req.user.id,
        } );   

        console.log(req.body);

        const post = await newPost.save();

         res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    
    }
    
});

module.exports = router;