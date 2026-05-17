const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const tokenService = require('./token.service');
const userService = require('./user.service');
const db = require("../models");
const Token = db.token;
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/token');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }
    return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
// const logout = async (refreshToken) => {
//     const refreshTokenDoc = await Token.findOne({
//         where: {
//             token: refreshToken,
//             type: tokenTypes.REFRESH,
//             black_listed: false
//         }
//     });

//     console.log({authService: refreshTokenDoc})

//     if (!refreshTokenDoc) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
//     }
//     await refreshTokenDoc.destroy();
// };

// --------------------------------------------

const logout = async (refreshToken) => {
    console.log('Attempting to find token:', refreshToken);
    
    try {
        const refreshTokenDoc = await Token.findOne({
            where: {
                token: refreshToken,
                type: tokenTypes.REFRESH,
                black_listed: false
            }
        });
        
        console.log({ authService: refreshTokenDoc });
        
        if (!refreshTokenDoc) {
            console.log('Token not found in database');
            // Don't throw error - token might already be deleted or expired
            return;
        }

        // Try to delete the token
        const deleteResult = await refreshTokenDoc.destroy();
        console.log('Token deletion result:', deleteResult);
        
        // Alternative: Mark as blacklisted instead of deleting
        // await refreshTokenDoc.update({ black_listed: true });
        
    } catch (error) {
        console.error('Error during token deletion:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to logout');
    }
};

// --------------------------------------------

/**
 * Logout from all devices
 * @param {string} userId
 * @returns {Promise}
 */
const logoutFromAllDevices = async (userId) => {
    await db.Session.destroy({ where: { user_id: userId } });
    await db.Token.destroy({ where: { user_id: userId, type: tokenTypes.REFRESH } });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await userService.getUserById(refreshTokenDoc.user_id);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        await refreshTokenDoc.destroy();
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
};
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<boolean>}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        
        const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
        
        
        const user = await userService.getUserById(resetPasswordTokenDoc.user_id);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }

       
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userService.updateUserById(user.id, { password: hashedPassword });
        await Token.destroy({ where: { user_id: user.id, type: tokenTypes.RESET_PASSWORD } });

        return true; 
    } catch (error) {
        console.error("Error during password reset:", error.message);
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
        const user = await userService.getUserById(verifyEmailTokenDoc.user_id);

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        await Token.destroy({ where: { user_id: user.id, type: tokenTypes.VERIFY_EMAIL } });
        await userService.updateUserById(user.id, { active: 1 });

    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
};

/**
 * Forgot password
 * @param {string} email
 * @returns {Promise}
 */
const forgotPassword = async (email) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
    }

    const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
    if (!resetPasswordToken) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error generating reset password token');
    }

   
    try {
        await tokenService.sendResetPasswordEmail(email, resetPasswordToken);
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending reset password email');
    }

    return { message: 'Password reset email sent successfully' };
};

module.exports = {
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail,
    logoutFromAllDevices,
    forgotPassword
};
