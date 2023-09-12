const User = require("./../models/users");

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
const getOneUser = async (req, res) => {
    const foundUser = await User.findOne({ _id: req.params.id });
    res.send(foundUser);
}
const deleteUser = async (req, res) => {
    const foundUser = await User.deleteOne({ _id: req.params.id });
    res.send(foundUser);
}

module.exports = {
    getAllUsers,
    createUser,
    getOneUser,
    deleteUser
};