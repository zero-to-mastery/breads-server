let bcrypt = require('bcrypt');

exports.comparePassword = function(candidatePassword, password, next) {
    bcrypt.compare(candidatePassword, password, function(err, isMatch) {
        if(err) return next(err);
        next(null, isMatch);
    });
}