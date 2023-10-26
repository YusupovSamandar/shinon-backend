const User = require("./../models/users");
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const sharp = require("sharp");
dotenv.config();

const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("./../s3remoteConfig");


const bucketName = process.env.BUCKET_NAME;

const getAllUsers = async (req, res) => {
    const allUsers = await User.find({});
    res.send(allUsers);
}

const createUser = async (req, res) => {
    // shinon-bucket
    //shinon-bucket-access

    try {
        const fileExtension = req.file && path.extname(req.file.originalname);
        const userLogin = req.body.login;
        const uniqueFilename = req.file && `${userLogin}${fileExtension}`;
        const profPicName = req.file ? `${uniqueFilename}` : 'none'

        const resizedProfilePicBuffer = await sharp(req.file.buffer).resize({ height: 500, width: 500, fit: "contain" }).toBuffer();

        if (req.file) {
            const params = {
                Bucket: bucketName,
                Key: uniqueFilename,
                Body: resizedProfilePicBuffer,
                ContentType: req.file.mimetype
            }
            const command = new PutObjectCommand(params);
            await s3.send(command);
        }
        const newUser = new User({ ...req.body, profilePicture: profPicName });
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
        if (foundUser.profilePicture !== "none") {
            const getObjectParams = {
                Bucket: bucketName,
                Key: foundUser.profilePicture
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            res.send({ ...foundUser._doc, profilePictureURL: url });
        } else {
            res.send(foundUser);
        }
    } catch (error) {
        res.status(404).json({ error: 'user not found' });
    }
}
const deleteUser = async (req, res) => {
    const foundUser = await User.findOneAndDelete({ _id: req.params.id });
    if (foundUser.profilePicture !== "none") {
        const deleteObjectParams = {
            Bucket: bucketName,
            Key: foundUser.profilePicture
        }
        const command = new DeleteObjectCommand(deleteObjectParams);
        await s3.send(command);
    }

    res.send(foundUser);
}
const logoutUser = async (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
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

    const refreshTokenCookieConfig = req.body.rememberMe ? { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) } : { httpOnly: true, sameSite: 'None', secure: true }

    console.log(token);
    console.log(refreshToken);
    res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true });
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

// bicypt - password
// allow cookies Safari
// run both in the same dev