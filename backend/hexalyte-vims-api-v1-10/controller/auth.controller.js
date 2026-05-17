const authService = require("../service/auth.service");
const tokenService = require("../service/token.service");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const userService = require("../service/user.service");
const emailService = require("../service/email.service");
const securityService = require("../service/security.service");
const ApiError = require("../utils/ApiError");

/**
 * Login
 */
const login = catchAsync(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: "Invalid credentials" });
  }

  const tokens = await tokenService.generateAuthTokens(user, rememberMe);
  
  // Get security preferences for this user (with fallback if table doesn't exist)
  let security = {
    is_first_login: true,
    pin_enabled: false,
    biometric_enabled: false,
    failed_attempts: 0,
    is_locked_out: false,
    lockout_until: null
  };
  
  try {
    security = await securityService.getSecuritySummary(user.id);
    
    // Mark first login as complete if it was the first login
    if (security.is_first_login) {
      await securityService.markFirstLoginComplete(user.id);
      security.is_first_login = false;
    }
  } catch (securityError) {
    console.log('Security preferences not available, using defaults:', securityError.message);
    // Continue with default security settings
  }
  
  // return res.status(httpStatus.OK).cookie('token', tokens, { httpOnly: true}).send({ message: "Login successful", user, accessTokenExpiry: tokens.access.expires });
  return res.status(httpStatus.CREATED).send({ 
    message: "Login successful", 
    user, 
    tokens,
    security 
  });
});

/**
 * Register
 */

// req.cookies?.token?.access.token
// req.cookies?.token?.tokens.refresh.token

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  if (user) {
    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(httpStatus.CREATED).send({ message: "Registration successful", user, tokens });
    // return res.status(httpStatus.CREATED).cookie('token', tokens, { httpOnly: true}).send({ message: "Registration successful", user, accessTokenExpiry: tokens.access.expires })
  }
  res.status(httpStatus.CONFLICT).send({ message: "User already exists" });
});

/**
 * Logout
 */
// const logout = catchAsync(async (req, res) => {
//   console.log({ controller: req.cookies?.token?.refresh.token})
//   await authService.logout(req.cookies?.token?.refresh.token);
//   return res.status(httpStatus.NO_CONTENT).send({ message: "Logout successful" });
// });

// ----------------------------------------------------

const logout = catchAsync(async (req, res) => {
  // Get refresh token from multiple possible sources
  let refreshToken;

  // Check cookies first (most common)
  if (req.cookies?.token?.refresh?.token) {
    refreshToken = req.cookies.token.refresh.token;
  }
  // Check if token is stored differently in cookies
  else if (req.cookies?.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }
  // Check request body as fallback
  else if (req.body?.refreshToken) {
    refreshToken = req.body.refreshToken;
  }
  // Check Authorization header as last resort
  else if (req.headers.authorization) {
    refreshToken = req.headers.authorization.replace('Bearer ', '');
  }

  console.log({
    controller: refreshToken,
    cookies: req.cookies,
    cookieNames: Object.keys(req.cookies || {})
  });

  let userId = null;
  
  // Try to get user ID from refresh token before deleting it
  if (refreshToken) {
    try {
      const tokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
      userId = tokenDoc.user_id;
    } catch (error) {
      console.log('Could not extract user ID from token:', error.message);
    }
  }

  if (!refreshToken) {
    // Still clear cookies even if no token found
    clearAuthCookies(res);
    return res.status(httpStatus.OK).json({ message: "Logout successful" });
  }

  try {
    await authService.logout(refreshToken);
    
    // Reset security settings for this user if we have the user ID
    if (userId) {
      console.log('Resetting security settings for user:', userId);
      await securityService.resetSecuritySettings(userId);
    }
    
  } catch (error) {
    console.log('Token deletion error:', error.message);
    // Continue with logout even if token deletion fails
  }

  // Clear all authentication-related cookies
  clearAuthCookies(res);

  return res.status(httpStatus.OK).json({ message: "Logout successful" });
});

const clearAuthCookies = (res) => {
  // Clear different possible cookie names
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  // Clear common cookie names
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('authToken', cookieOptions);

  // Clear with different paths if needed
  res.clearCookie('token', { ...cookieOptions, path: '/api' });
  res.clearCookie('token', { ...cookieOptions, path: '/auth' });
};

// ----------------------------------------------------

/**
 * Refresh Tokens
 */
const refreshTokens = catchAsync(async (req, res) => {
  // Get refresh token from multiple sources (backward compatibility)
  let refreshToken = null;
  
  // Option 1: Authorization header (current backend expectation)
  if (req.headers.authorization) {
    refreshToken = req.headers.authorization.replace('Bearer ', '');
    console.log('Refresh token from Authorization header:', refreshToken);
  }
  // Option 2: Request body (Flutter app sends it this way)
  else if (req.body.refresh_token) {
    refreshToken = req.body.refresh_token;
    console.log('Refresh token from request body:', refreshToken);
  }
  // Option 3: Request body alternative format
  else if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
    console.log('Refresh token from request body (alt):', refreshToken);
  }
  
  if (!refreshToken) {
    return res.status(httpStatus.BAD_REQUEST).send({ 
      status: "fail", 
      message: "Refresh token is required in Authorization header or request body" 
    });
  }
  
  try {
    const tokens = await authService.refreshAuth(refreshToken);
    
    // Return tokens in multiple formats for compatibility
    res.status(httpStatus.OK).send({ 
      message: "Tokens refreshed successfully", 
      tokens: tokens,
      // Additional formats for Flutter compatibility
      access_token: tokens.access.token,
      accessToken: tokens.access.token,
      refresh_token: tokens.refresh.token,
      refreshToken: tokens.refresh.token,
      token: tokens.access.token, // Simple format
      accessTokenExpiry: tokens.access.expires
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(httpStatus.UNAUTHORIZED).send({ 
      status: "fail", 
      message: error.message || "Invalid or expired refresh token" 
    });
  }
});

/**
 * Forgot Password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ status: "fail", message: "No user found with this email" });
  }
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  if (!resetPasswordToken) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: "fail", message: "Error generating reset token" });
  }
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(httpStatus.OK).send({ status: "success", message: "Password reset email sent successfully", resettoken: resetPasswordToken });
});

/**
 * Reset Password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  const result = await authService.resetPassword(token, password);
  if (!result) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Password reset failed: Invalid or expired token." });
  }
  res.status(httpStatus.NO_CONTENT).send({ message: "Password reset successfully" });
});

/**
 * Send Verification Email
 */
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send({ message: "Verification email sent successfully", verifytoken: verifyEmailToken });
});

/**
 * Verify Email
 */
const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send({ message: "Email verified successfully" });
});

// ============= SECURITY ENDPOINTS =============

/**
 * Get Security Preferences
 */
const getSecurityPreferences = catchAsync(async (req, res) => {
  const security = await securityService.getSecuritySummary(req.user.id);
  res.status(httpStatus.OK).send({ 
    message: "Security preferences retrieved successfully", 
    security 
  });
});

/**
 * Update Security Preferences
 */
const updateSecurityPreferences = catchAsync(async (req, res) => {
  const { pin_enabled, biometric_enabled } = req.body;  // device_id TEMPORARILY DISABLED
  
  const preferences = await securityService.updateSecurityPreferences(req.user.id, {
    pin_enabled,
    biometric_enabled
    // device_id  // TEMPORARILY DISABLED
  });
  
  const security = await securityService.getSecuritySummary(req.user.id);
  res.status(httpStatus.OK).send({ 
    message: "Security preferences updated successfully", 
    security 
  });
});

/**
 * Track Failed PIN Attempt
 */
const trackFailedPinAttempt = catchAsync(async (req, res) => {
  // Check if user is already locked out
  const isLocked = await securityService.isUserLockedOut(req.user.id);
  if (isLocked) {
    return res.status(httpStatus.TOO_MANY_REQUESTS).send({ 
      message: "Account temporarily locked due to too many failed attempts" 
    });
  }
  
  const preferences = await securityService.trackFailedPinAttempt(req.user.id);
  const security = await securityService.getSecuritySummary(req.user.id);
  
  res.status(httpStatus.OK).send({ 
    message: "Failed attempt recorded", 
    security 
  });
});

/**
 * Reset PIN Attempts (on successful PIN entry)
 */
const resetPinAttempts = catchAsync(async (req, res) => {
  await securityService.resetPinAttempts(req.user.id);
  const security = await securityService.getSecuritySummary(req.user.id);
  
  res.status(httpStatus.OK).send({ 
    message: "PIN attempts reset successfully", 
    security 
  });
});

/**
 * Reset Security Settings (called during logout)
 */
const resetSecuritySettings = catchAsync(async (req, res) => {
  await securityService.resetSecuritySettings(req.user.id);
  res.status(httpStatus.OK).send({ 
    message: "Security settings reset successfully" 
  });
});

module.exports = {
  login,
  register,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  // Security endpoints
  getSecurityPreferences,
  updateSecurityPreferences,
  trackFailedPinAttempt,
  resetPinAttempts,
  resetSecuritySettings,
};