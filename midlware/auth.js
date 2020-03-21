const jwt = require ('jsonwebtoken');
const config = require ('config');

module.exports = function(req,res,next){
    // Get tocken from header 

    const tocken = req.header('x-auth-token');

    // Check if no tocken 
    if(!tocken){
        return res.status(401).json({
            msg: 'No token, authorisation denied'
        });
    }
        // Verify tocken 
        try {
            const decoed= jwt.verify(tocken,config.get('JwtSecret'));
            req.user= decoed.user;
            next();
        } catch (error) {
            res.status(401).json({
                msg : 'Token is not valid'
            });
        }
    
}