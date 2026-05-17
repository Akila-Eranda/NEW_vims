// Simple syntax check without requiring modules
const fs = require('fs');
const path = require('path');

const files = [
  'service/security.service.js',
  'controller/auth.controller.js',
  'validations/auth.validation.js', 
  'route/v1/auth.route.js',
  'models/usersecuritypreferences.js'
];

console.log('🔍 Simple Syntax Check (JavaScript parsing only)...\n');

files.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Basic syntax checks
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      
      console.log(`📄 ${file}:`);
      
      if (openBraces !== closeBraces) {
        console.log(`   ❌ Mismatched braces: ${openBraces} open, ${closeBraces} close`);
      }
      
      if (openParens !== closeParens) {
        console.log(`   ❌ Mismatched parentheses: ${openParens} open, ${closeParens} close`);
      }
      
      // Check for basic JavaScript syntax issues
      if (content.includes('require(') && !content.includes('require(\'') && !content.includes('require("')) {
        console.log(`   ⚠️  Potential require() syntax issue`);
      }
      
      if (openBraces === closeBraces && openParens === closeParens) {
        console.log(`   ✅ Basic syntax looks good`);
      }
      
    } else {
      console.log(`📄 ${file}: ❌ File not found`);
    }
  } catch (error) {
    console.log(`📄 ${file}: ❌ Error reading file: ${error.message}`);
  }
});

console.log('\n✅ Simple syntax check complete!');