const User = require("./../../models/users");

async function createAdminUser() {
    try {
        const allUsers = await User.find({});
        if (allUsers.length === 0) {
            const adminUser = await User.findOne({ login: 'admin' });
            if (!adminUser) {
                // Create admin user if not exists
                const newUser = new User({
                    login: 'admin',
                    password: 'admin123', // Set a secure password for the admin user
                    role: "admin", // Assign admin privileges to this user
                });
                await newUser.save();
            }
        }
        // Check if admin user already exists
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

module.exports = {
    createAdminUser
};