var jwt = require('jsonwebtoken');

var login_api = function (req, res, next) {
    token = req.headers.authorization;
    if(req.headers.authorization) {
        jwt.verify(token,process.env.SECRET_KEY,function(err,data){
            if(err){
                res.send('wrong user, please log in again');
            }else{
                console.log(data);
            }
          })
        next();
    } else {
        res.send('not logged in');
    }
}

module.exports = login_api;
