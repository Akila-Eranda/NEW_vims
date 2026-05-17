// const passport = require('passport');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');
// const { roleRights } = require('../config/roles');

// const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
//     if (err || info || !user) {
//         return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//     }
//     req.user = user;

//     if (requiredRights.length) {
//         const userRights = roleRights.get(user.role);
//         const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
//         if (!hasRequiredRights && req.params.userId !== user.id) {
//             return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
//         }
//     }

//     resolve();
// };

// const auth = (...requiredRights) => async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//         passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
//     })
//         .then(() => next())
//         .catch((err) => next(err));
// };

// module.exports = auth;

const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    
    // Always check rights if specified
    if (requiredRights.length) {
        const userRights = roleRights.get(user.role);
        
        // Check if user has role defined in roleRights
        if (!userRights) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Invalid user role'));
        }
        
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        
        // Only allow access if user has required rights OR owns the resource
        if (!hasRequiredRights && req.params.userId !== user.id) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
        }
    }
    
    resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};

// Additional helper for stricter access control
const authStrict = (...requiredRights) => async (req, res, next) => {
    if (requiredRights.length === 0) {
        return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'No permissions specified for this endpoint'));
    }
    
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || info || !user) {
                return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
            }
            
            req.user = user;
            const userRights = roleRights.get(user.role);
            
            if (!userRights) {
                return reject(new ApiError(httpStatus.FORBIDDEN, 'Invalid user role'));
            }
            
            const hasRequiredRights = requiredRights.every(right => userRights.includes(right));
            
            if (!hasRequiredRights) {
                return reject(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
            }
            
            resolve();
        })(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};

// Helper for owner-only access
const authOwnerOnly = () => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || info || !user) {
                return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
            }
            
            req.user = user;
            
            // Check if user is accessing their own resource
            if (req.params.userId && req.params.userId !== user.id) {
                return reject(new ApiError(httpStatus.FORBIDDEN, 'Access denied: can only access own resources'));
            }
            
            resolve();
        })(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};

module.exports = {
    auth,
    authStrict,
    authOwnerOnly
};