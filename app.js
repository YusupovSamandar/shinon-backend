const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');


// api routes

const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const updatesRoutes = require('./routes/updatesRoutes');



// Load environment variables from a .env file
dotenv.config();

// Create an Express app
const app = express();

app.use(express.json());
app.use(cookieParser());

// app.use(
//     session({
//         secret: process.env.SECRET_COOKIES_KEY, // Change this to a strong, random secret
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: false }, // Set to true in production with HTTPS
//     })
// );

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://192.168.9.167:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept-Type"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://192.168.9.167:3000', // Replace with your client's origin
    credentials: true, // Allow cookies
}));

// Connect to MongoDB using mongoose
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
mongoose.pluralize(null);

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(`MongoDB Connection Error: ${err}`);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
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
                    expiresIn: '20s', // New access token expiration time
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

// Define routes and controllers here
app.use('/api/users', userRoutes);
app.use('/api/patients', authenticateToken, patientRoutes);
app.use('/api/updates', authenticateToken, updatesRoutes);



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
