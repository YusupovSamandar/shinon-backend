const jwt = require('jsonwebtoken');
module.exports = function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token && !req.cookies.refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.SECRET_COOKIES_KEY, (err, user) => {


        if (err) {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(403).json({ error: 'Access token expired and no refresh token available' });
            }

            jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY, (refreshErr, refreshUser) => {
                if (refreshErr) {
                    return res.status(403).json({ error: 'Refresh token invalid' });
                }

                // Generate a new access token
                const newAccessToken = jwt.sign({ userId: refreshUser.userId }, process.env.SECRET_COOKIES_KEY, {
                    expiresIn: '1h', // New access token expiration time
                });



                // Set the new access token in cookies
                res.cookie('token', newAccessToken, { httpOnly: true });
                console.log("new token added");

                // Continue with the request
                req.user = refreshUser;
                next();
            });
        } else {
            req.user = user;
            next();
        }

    });
}