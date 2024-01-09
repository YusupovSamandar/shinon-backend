const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { createAdminUser } = require("./controllers/actions/users");
const authenticateToken = require("./middlewares/authenticateToken");
const { cron } = require("./controllers/cron/clean-messages");

// api routes

const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const updatesRoutes = require('./routes/updatesRoutes');



// Load environment variables from a .env file
dotenv.config();

// Create an Express app
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://shinon.vercel.app");
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
    origin: 'https://shinon.vercel.app', // Replace with your client's origin
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
    // create admin if not already
    createAdminUser();
});

app.use("/cron", cron);

// Define routes and controllers here
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/hospitals', hospitalRoutes);



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;