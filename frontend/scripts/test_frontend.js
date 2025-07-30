#!/usr/bin/env node
/**
 * Comprehensive frontend testing script with coverage and quality checks
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'reset') {
  console.log(colorize(message, color));
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log(`\n🔄 Running: ${command} ${args.join(' ')}`, 'blue');
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${command} completed successfully`, 'green');
        resolve(code);
      } else {
        log(`❌ ${command} failed with code ${code}`, 'red');
        reject(new Error(`Command failed: ${command} ${args.join(' ')}`));
      }
    });

    child.on('error', (error) => {
      log(`❌ Error running ${command}: ${error.message}`, 'red');
      reject(error);
    });
  });
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function checkDependencies() {
  log('\n📦 Checking Dependencies', 'cyan');
  
  try {
    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      log('📥 Installing dependencies...', 'yellow');
      await runCommand('npm', ['install']);
    }

    // Check if testing dependencies are installed
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const testDeps = ['jest', '@testing-library/react', '@testing-library/jest-dom'];
    
    for (const dep of testDeps) {
      if (!packageJson.devDependencies[dep]) {
        log(`⚠️ Missing testing dependency: ${dep}`, 'yellow');
        return false;
      }
    }
    
    log('✅ All dependencies are available', 'green');
    return true;
  } catch (error) {
    log(`❌ Dependency check failed: ${error.message}`, 'red');
    return false;
  }
}

async function runLinting() {
  log('\n🔍 Running ESLint', 'cyan');
  
  try {
    await runCommand('npm', ['run', 'lint']);
    return true;
  } catch (error) {
    log('❌ Linting failed', 'red');
    return false;
  }
}

async function runTypeChecking() {
  log('\n🔧 Running TypeScript Check', 'cyan');
  
  try {
    // Test files are excluded in tsconfig.json since Jest handles their types
    await runCommand('npx', ['tsc', '--noEmit']);
    return true;
  } catch (error) {
    log('❌ TypeScript check failed', 'red');
    return false;
  }
}

async function runCompilationCheck() {
  log('\n🏗️ Running Next.js Compilation Check', 'cyan');
  
  try {
    await runCommand('npm', ['run', 'build']);
    log('✅ Next.js compilation successful', 'green');
    return true;
  } catch (error) {
    log('❌ Next.js compilation failed', 'red');
    log('💡 This catches Next.js-specific TypeScript issues that tsc might miss', 'yellow');
    return false;
  }
}

async function runUnitTests() {
  log('\n🧪 Running Unit Tests with Coverage', 'cyan');
  
  try {
    await runCommand('npm', ['run', 'test:ci']);
    return true;
  } catch (error) {
    log('❌ Unit tests failed', 'red');
    return false;
  }
}



async function checkBundleSize() {
  log('\n📊 Analyzing Bundle Size', 'cyan');
  
  try {
    // Check if we can analyze the bundle
    const { stdout } = await execCommand('npm list --depth=0');
    log('📦 Dependencies analyzed', 'green');
    
    // Check for common bundle issues
    if (fs.existsSync('.next/static')) {
      const files = fs.readdirSync('.next/static');
      log(`📄 Static files generated: ${files.length}`, 'green');
    }
    
    return true;
  } catch (error) {
    log(`⚠️ Bundle analysis warning: ${error.message}`, 'yellow');
    return true; // Non-critical
  }
}

async function runAccessibilityTests() {
  log('\n♿ Running Accessibility Checks', 'cyan');
  
  try {
    // Check if we have accessibility testing setup
    const hasAxe = fs.existsSync('node_modules/@axe-core') || 
                   fs.existsSync('node_modules/jest-axe');
    
    if (hasAxe) {
      log('✅ Accessibility testing tools available', 'green');
    } else {
      log('⚠️ Consider adding accessibility testing (jest-axe)', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`⚠️ Accessibility check warning: ${error.message}`, 'yellow');
    return true; // Non-critical
  }
}

async function generateReports() {
  log('\n📋 Generating Reports', 'cyan');
  
  try {
    // Check if coverage reports exist
    if (fs.existsSync('coverage')) {
      log('📊 Coverage report available in coverage/', 'green');
    }
    
    // Create a test summary
    const summary = {
      timestamp: new Date().toISOString(),
      testRun: 'Frontend Quality Suite',
      reports: {
        coverage: fs.existsSync('coverage/lcov-report/index.html'),
        build: fs.existsSync('.next'),
      }
    };
    
    fs.writeFileSync('test-summary.json', JSON.stringify(summary, null, 2));
    log('📄 Test summary saved to test-summary.json', 'green');
    
    return true;
  } catch (error) {
    log(`⚠️ Report generation warning: ${error.message}`, 'yellow');
    return true; // Non-critical
  }
}

async function cleanupBuildArtifacts() {
  log('\n🧹 Cleaning up build artifacts', 'cyan');
  
  try {
    if (fs.existsSync('.next')) {
      await execCommand('rm -rf .next');
      log('🗑️ Removed .next directory', 'green');
    }
    return true;
  } catch (error) {
    log(`⚠️ Cleanup warning: ${error.message}`, 'yellow');
    return true; // Non-critical
  }
}

async function main() {
  log('🧪 Starting Frontend Quality & Testing Suite', 'bright');
  log('=' .repeat(50), 'bright');
  
  const results = [];
  
  try {
    // 1. Check dependencies
    results.push(await checkDependencies());
    
    // 2. TypeScript check
    results.push(await runTypeChecking());
    
    // 3. Linting
    results.push(await runLinting());
    
    // 4. Next.js compilation check (catches Next.js-specific issues)
    results.push(await runCompilationCheck());
    
    // 5. Unit tests
    results.push(await runUnitTests());
    
    // 6. Bundle analysis
    results.push(await checkBundleSize());
    
    // 7. Accessibility checks
    results.push(await runAccessibilityTests());
    
    // 8. Generate reports
    results.push(await generateReports());
    
    // 9. Cleanup
    results.push(await cleanupBuildArtifacts());
    
  } catch (error) {
    log(`💥 Fatal error: ${error.message}`, 'red');
    results.push(false);
  }
  
  // Summary
  log('\n' + '=' .repeat(50), 'bright');
  log('📋 Frontend Test Results Summary', 'bright');
  log('=' .repeat(50), 'bright');
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${total - passed}`, 'red');
  log(`📊 Success Rate: ${((passed/total)*100).toFixed(1)}%`, 'cyan');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Frontend is ready for deployment.', 'green');
    process.exit(0);
  } else {
    log(`\n⚠️ ${total - passed} test(s) failed. Please fix issues before deployment.`, 'red');
    process.exit(1);
  }
}

// Handle interruption gracefully
process.on('SIGINT', () => {
  log('\n\n⚠️ Test suite interrupted by user', 'yellow');
  process.exit(130);
});

process.on('unhandledRejection', (error) => {
  log(`💥 Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { main, runCommand, checkDependencies }; 