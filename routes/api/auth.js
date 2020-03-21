const express = require('express');
const router = express.Router();
const auth = require('../../midlware/auth');
const User = require ('../../models/User');
const { check, validationResult } = require ('express-validator');
const config = require('config');
const bcrypt= require('bcryptjs');
const jwt = require ('jsonwebtoken');


// @route Get api/auth
// @desc Test route 
// @acess Public
router.get ('/',auth,async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        Console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route Post api/auth
// @desc check user  
// @acess Public
router.post ('/',[

    check('email','Please add valid email ')
    .isEmail(),

    check('password','Please enter password length max 6')
    .exists()
],async(req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid credentials ! '
                }]
            });
        }

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid password ! '
                }]
            });
        }
        const payload= {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload,config.get('JwtSecret'),
        {expiresIn: 36000},(err,tocken)=>{
            if(err) throw err;

            res.json({tocken});

        })

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }    
});



module.exports = router;