// Quick syntax check for new security files
console.log('🔄 Checking syntax of new security files...');

try {
  // Check security service
  console.log('📄 Checking security.service.js...');
  const securityService = require('./service/security.service.js');
  console.log('✅ security.service.js - OK');
  
  console.log('📄 Checking controller updates...');
  const authController = require('./controller/auth.controller.js');
  console.log('✅ auth.controller.js - OK');
  
  console.log('📄 Checking validation updates...');
  const authValidation = require('./validations/auth.validation.js');
  console.log('✅ auth.validation.js - OK');
  
  console.log('📄 Checking route updates...');
  const authRoutes = require('./route/v1/auth.route.js');
  console.log('✅ auth.route.js - OK');
  
  console.log('🎉 All syntax checks passed!');
  
} catch (error) {
  console.error('❌ Syntax error found:', error.message);
  console.error(error.stack);
  process.exit(1);
}