const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().optional(), 
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    token: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

// ============= SECURITY VALIDATION SCHEMAS =============

const updateSecurityPreferences = {
  body: Joi.object().keys({
    pin_enabled: Joi.boolean().optional(),
    biometric_enabled: Joi.boolean().optional(),
    device_id: Joi.string().optional().allow(null)
  }).min(1), // At least one field must be provided
};

const trackFailedPinAttempt = {
  body: Joi.object().keys({
    // No body parameters needed - user ID comes from auth token
  }),
};

const resetPinAttempts = {
  body: Joi.object().keys({
    // No body parameters needed - user ID comes from auth token
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  // Security validations
  updateSecurityPreferences,
  trackFailedPinAttempt,
  resetPinAttempts,
};
