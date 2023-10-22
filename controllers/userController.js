const User = require("./../models/users");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const getAllUsers = async (req, res) => {
    const allUsers = await User.find({});
    res.send(allUsers);
}

const createUser = async (req, res) => {
    try {
        const newUser = new User({ ...req.body, profilePicture: req.file ? `/uploads/users/${req.file.filename}` : 'none' });
        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            // Send a custom error response to the client
            res.status(400).send('User with same login already exists');
        } else {
            res.status(500).send('Error: ' + err.message);
        }
    }
}

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true
        });
        res.send(updatedUser);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}

const getOneUser = async (req, res) => {
    try {
        const foundUser = await User.findOne({ _id: req.params.id });
        res.send(foundUser);
    } catch (error) {
        res.status(404).json({ error: 'user not found' });
    }
}
const deleteUser = async (req, res) => {
    const foundUser = await User.deleteOne({ _id: req.params.id });
    res.send(foundUser);
}
const logoutUser = async (req, res) => {
    res.clearCookie('token', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });
    res.status(204).json({ msg: "logout success" });
}

const loginUser = async (req, res) => {
    const { login, password } = req.body;
    const foundUser = await User.findOne({ login, password });
    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: foundUser._id }, process.env.SECRET_COOKIES_KEY, {
        expiresIn: '1h', // Token expiration time
    });
    const refreshToken = jwt.sign({ userId: foundUser._id }, process.env.SECRET_REFRESH_KEY, {
        expiresIn: '14d', // Refresh token expiration time (longer)
    });

    const refreshTokenCookieConfig = req.body.rememberMe ? { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), secure: true } : { httpOnly: true, secure: true }

    console.log(token);
    console.log(refreshToken);
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, refreshTokenCookieConfig);

    return res.status(200).json({ msg: 'Login successful', user: foundUser });
}

module.exports = {
    getAllUsers,
    createUser,
    getOneUser,
    deleteUser,
    updateUser,
    loginUser,
    logoutUser
};