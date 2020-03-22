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

// get All  Post 

router.get('/',auth,async (req,res)=>{
    try {
        const posts =  await Post.find().sort({
            date : -1
        });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// get post by id 
router.get('/:id',auth,async (req,res)=>{
    try {
            
        const post =  await Post.findById(req.params.id).sort({
            date : -1
        });
        if(!post){
            return res.status(404).json({
                msg : 'Post not found'
            });
        }

        
        res.json(post);
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({
                msg : 'Post not found'
            });
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// delete post by id 
router.delete('/:id',auth,async (req,res)=>{
    try {
            
        const post =  await Post.findById(req.params.id).sort({
            date : -1
        });

        if(!post){
            return res.status(404).json({
                msg : 'Post not found'
            });
        }
        // check user 
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({
                msg : 'User not auth'
            });
        }

        await post.remove();
        
        res.json({
            msg: 'Post deleted'
        });
        
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({
                msg : 'Post not found'
            });
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;