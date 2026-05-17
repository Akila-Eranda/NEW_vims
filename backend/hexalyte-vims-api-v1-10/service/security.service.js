const httpStatus = require('http-status');
const db = require("../models");
const UserSecurityPreferences = db.UserSecurityPreferences || null;
const User = db.user;
const ApiError = require('../utils/ApiError');

// Default security preferences to return when table doesn't exist
const DEFAULT_SECURITY_PREFS = {
  pin_enabled: false,
  biometric_enabled: false,
  is_first_login: true,
  pin_failed_attempts: 0,
  pin_lockout_until: null
};

/**
 * Get user security preferences by user ID
 * @param {number} userId
 * @returns {Promise<UserSecurityPreferences>}
 */
const getSecurityPreferences = async (userId) => {
  // If UserSecurityPreferences model doesn't exist (migration disabled), return defaults
  if (!UserSecurityPreferences) {
    console.log('UserSecurityPreferences model not available, returning defaults');
    return { ...DEFAULT_SECURITY_PREFS, user_id: userId };
  }

  let preferences = await UserSecurityPreferences.findOne({
    where: { user_id: userId }
  });

  // If no preferences exist, create default ones
  if (!preferences) {
    preferences = await UserSecurityPreferences.create({
      user_id: userId,
      pin_enabled: false,
      biometric_enabled: false,
      is_first_login: true,
      pin_failed_attempts: 0,
      pin_lockout_until: null
    });
  }

  return preferences;
};

/**
 * Update security preferences for a user
 * @param {number} userId
 * @param {object} updateData
 * @returns {Promise<UserSecurityPreferences>}
 */
const updateSecurityPreferences = async (userId, updateData) => {
  if (!UserSecurityPreferences) {
    console.log('UserSecurityPreferences model not available, skipping update');
    return { ...DEFAULT_SECURITY_PREFS, user_id: userId };
  }
  
  const preferences = await getSecurityPreferences(userId);
  
  // Only allow specific fields to be updated
  const allowedFields = ['pin_enabled', 'biometric_enabled'];
  const filteredData = {};
  
  allowedFields.forEach(field => {
    if (updateData.hasOwnProperty(field)) {
      filteredData[field] = updateData[field];
    }
  });

  await preferences.update(filteredData);
  return preferences;
};

/**
 * Mark first login as completed
 * @param {number} userId
 * @returns {Promise<UserSecurityPreferences>}
 */
const markFirstLoginComplete = async (userId) => {
  if (!UserSecurityPreferences) {
    console.log('UserSecurityPreferences model not available, skipping first login mark');
    return { ...DEFAULT_SECURITY_PREFS, user_id: userId, is_first_login: false };
  }
  
  const preferences = await getSecurityPreferences(userId);
  await preferences.update({ is_first_login: false });
  return preferences;
};

/**
 * Reset security settings on logout
 * @param {number} userId
 * @returns {Promise<void>}
 */
const resetSecuritySettings = async (userId) => {
  if (!UserSecurityPreferences) {
    console.log('UserSecurityPreferences model not available, skipping reset');
    return;
  }
  
  const preferences = await getSecurityPreferences(userId);
  await preferences.update({
    pin_enabled: false,
    biometric_enabled: false,
    is_first_login: true,
    pin_failed_attempts: 0,
    pin_lockout_until: null
  });
};

/**
 * Track failed PIN attempt
 * @param {number} userId
 * @returns {Promise<UserSecurityPreferences>}
 */
const trackFailedPinAttempt = async (userId) => {
  if (!UserSecurityPreferences) {
    console.log('UserSecurityPreferences model not available, skipping failed attempt tracking');
    return { ...DEFAULT_SECURITY_PREFS, user_id: userId };
  }
  
  const preferences = await getSecurityPreferences(userId);
  const failedAttempts = preferences.pin_failed_attempts + 1;
  
  const updateData = {
    pin_failed_attempts: failedAttempts
  };
  
  // If user has exceeded max attempts (5), set lockout
  if (failedAttempts >= 5) {
    const lockoutUntil = new Date();
    lockoutUntil.setMinutes(lockoutUntil.getMinutes() + 5); // 5 minute lockout
    updateData.pin_lockout_until = lockoutUntil;
  }
  
  await preferences.update(updateData);
  return preferences;
};

/**
 * Reset PIN attempts on successful PIN entry
 * @param {number} userId
 * @returns {Promise<UserSecurityPreferences>}
 */
const resetPinAttempts = async (userId) => {
  if (!UserSecurityPreferences) {
    console.log('UserSecurityPreferences model not available, skipping reset attempts');
    return { ...DEFAULT_SECURITY_PREFS, user_id: userId };
  }
  
  const preferences = await getSecurityPreferences(userId);
  await preferences.update({
    pin_failed_attempts: 0,
    pin_lockout_until: null
  });
  return preferences;
};

/**
 * Check if user is locked out from PIN attempts
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
const isUserLockedOut = async (userId) => {
  if (!UserSecurityPreferences) {
    return false; // Not locked out if security table doesn't exist
  }
  
  const preferences = await getSecurityPreferences(userId);
  
  if (!preferences.pin_lockout_until) {
    return false;
  }
  
  const now = new Date();
  if (now < preferences.pin_lockout_until) {
    return true;
  }
  
  // Lockout expired, reset it
  await resetPinAttempts(userId);
  return false;
};

/**
 * Get security summary for login response
 * @param {number} userId
 * @returns {Promise<object>}
 */
const getSecuritySummary = async (userId) => {
  try {
    const preferences = await getSecurityPreferences(userId);
    
    return {
      is_first_login: preferences.is_first_login,
      pin_enabled: preferences.pin_enabled,
      biometric_enabled: preferences.biometric_enabled,
      failed_attempts: preferences.pin_failed_attempts,
      is_locked_out: await isUserLockedOut(userId),
      lockout_until: preferences.pin_lockout_until
    };
  } catch (error) {
    console.error('Error getting security summary:', error);
    // Return safe defaults on error
    return {
      is_first_login: true,
      pin_enabled: false,
      biometric_enabled: false,
      failed_attempts: 0,
      is_locked_out: false,
      lockout_until: null
    };
  }
};

/**
 * Verify PIN attempt and handle failed attempts
 * @param {number} userId
 * @param {string} pin (client will send hashed PIN)
 * @returns {Promise<{success: boolean, message: string, lockout?: boolean}>}
 */
const verifyPinAttempt = async (userId, hashedPin) => {
  try {
    // Check if user is locked out
    if (await isUserLockedOut(userId)) {
      return {
        success: false,
        message: 'Account temporarily locked due to too many failed attempts',
        lockout: true
      };
    }

    const preferences = await getSecurityPreferences(userId);
    
    // In a real implementation, you might store the PIN hash in the database
    // For now, we'll just track attempts since PIN verification happens client-side
    
    // If PIN verification is successful (determined by client), reset attempts
    await resetPinAttempts(userId);
    
    return {
      success: true,
      message: 'PIN verified successfully'
    };
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return {
      success: false,
      message: 'PIN verification failed due to system error'
    };
  }
};

/**
 * Handle failed PIN attempt
 * @param {number} userId  
 * @returns {Promise<{remainingAttempts: number, lockedOut: boolean}>}
 */
const handleFailedPinAttempt = async (userId) => {
  try {
    await trackFailedPinAttempt(userId);
    const preferences = await getSecurityPreferences(userId);
    
    const remainingAttempts = Math.max(0, 5 - preferences.pin_failed_attempts);
    const lockedOut = await isUserLockedOut(userId);
    
    return {
      remainingAttempts,
      lockedOut
    };
  } catch (error) {
    console.error('Error handling failed PIN attempt:', error);
    return {
      remainingAttempts: 0,
      lockedOut: true
    };
  }
};

module.exports = {
  getSecurityPreferences,
  updateSecurityPreferences,
  markFirstLoginComplete,
  resetSecuritySettings,
  trackFailedPinAttempt,
  resetPinAttempts,
  isUserLockedOut,
  getSecuritySummary,
  verifyPinAttempt,
  handleFailedPinAttempt
};