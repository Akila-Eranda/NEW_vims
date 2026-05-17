// const db = require("../models");
// const bcrypt = require('bcrypt');
// const User = db.user;
// const createUser = async (params) => {
//     const { firstname, lastname, username, email, password, role } = params;
//     try {
//         const salt = bcrypt.genSaltSync(10);
//         const hash = bcrypt.hashSync(password, salt);
//         const user = {
//             firstname,
//             lastname,
//             username,
//             email,
//             password: hash,
//             role,
//             active: 0,
//             deleted: 0
//         };

//         const [row, created] = await User.findOrCreate({
//             where: { email: user.email },
//             defaults: user,
//         });

//         if (created) {
//             return row;
//         }
//         return null;
//     } catch (error) {
//         throw new Error(`Error creating user: ${error.message}`);
//     }
// };

// const getAllUsers = async (filter = {}, options = { page: 1, limit: 10 }) => {
//     try {
//         const { page, limit } = options;
//         const users = await User.findAll({
//             where: filter,
//             offset: (page - 1) * limit,
//             limit: limit,
//         });
//         return users;
//     } catch (error) {
//         throw new Error('Error fetching users');
//     }
// };

// const getUserById = async (id) => {
//     try {
//         const user = await User.findOne({ where: { id } });
//         if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//         return user;
//     } catch (error) {
//         console.error('Error fetching user by ID:', error);
//         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching user by ID');
//     }
// };

// const getUserByEmail = async (email) => {
//     try {
//         return await User.findOne({where: {email}});
//     } catch (error) {
//         throw new Error('Error fetching user by email');
//     }
// };

// const updateUserById = async (userId, updateBody) => {
//     const { firstname, lastname, username, email, password, active } = updateBody;
//     try {
//         const user = {
//             firstname,
//             lastname,
//             username,
//             email,
//             active,
//         };

//         if (password) {
//             const salt = bcrypt.genSaltSync(10);
//             const hash = bcrypt.hashSync(password, salt);
//             user.password = hash;
//         }

//         const [updatedRowCount] = await User.update(user, {
//             where: { id: userId },
//         });

//         if (updatedRowCount === 0) {
//             throw new Error('User not found');
//         }
//         return updatedRowCount;
//     } catch (error) {
//         throw new Error('Error updating user');
//     }
// };

// const deleteUserById = async (userId) => {
//     try {
//         const user = await getUserById(userId);
//         if (!user) return null;
//         await user.destroy();
//         return user;
//     } catch (error) {
//         throw new Error('Error deleting user');
//     }
// };

// module.exports = {
//     createUser,
//     getAllUsers,
//     getUserById,
//     getUserByEmail,
//     updateUserById,
//     deleteUserById,
// };
const db = require("../models");
const bcrypt = require('bcryptjs');
const User = db.user;
const createUser = async (params) => {
    const { firstname, lastname, username, email, password, role ,gender, birthday} = params;
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const user = {
            firstname,
            lastname,
            username,
            email,
            password: hash,
            role,
            active: 1,
            deleted: 0,
            gender,
            birthday
        };

        const [row, created] = await User.findOrCreate({
            where: { email: user.email },
            defaults: user,
        });

        if (created) {
            return row;
        }
        return null;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const getAllUsers = async (filter = {}, options = { page: 1, limit: 10 }) => {
    try {
        const { page, limit } = options;
        const users = await User.findAll({
            where: filter,
            offset: (page - 1) * limit,
            limit: limit,
        });
        return users;
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

const getUserById = async (id) => {
    try {
        const user = await User.findOne({ where: { id } });
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching user by ID');
    }
};

const getUserByEmail = async (email) => {
    try {
        return await User.findOne({where: {email}});
    } catch (error) {
        throw new Error('Error fetching user by email');
    }
};

const updateUserById = async (userId, updateBody) => {
    const { firstname, lastname, username, email, password, active, gender, birthday, role } = updateBody;
    try {
        const user = {
            firstname,
            lastname,
            username,
            email,
            active,
            gender,
            birthday,
            role
        };

        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
        }

        const [updatedRowCount] = await User.update(user, {
            where: { id: userId },
        });

        if (updatedRowCount === 0) {
            throw new Error('User not found');
        }
        return updatedRowCount;
    } catch (error) {
        throw new Error('Error updating user');
    }
};

const deleteUserById = async (userId) => {
    try {
        const user = await getUserById(userId);
        if (!user) return null;
        await user.destroy();
        return user;
    } catch (error) {
        throw new Error('Error deleting user');
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
