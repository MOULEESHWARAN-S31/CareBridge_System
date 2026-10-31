/**
 * CareBridge Hospital Dashboard — Unified Test Suite Runner
 * Runs static source tests and real live backend integration tests.
 */

import { spawn } from 'child_process';
import path from 'path';

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Script ${scriptPath} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  console.log('Running Suite 1: Static RBAC & Route Integrity Tests...\n');
  await runScript(path.join('scripts', 'verify_roles.js'));

  console.log('\nRunning Suite 2: Real Backend Authentication & Live JWT Token Tests...\n');
  await runScript(path.join('scripts', 'test_real_auth_integration.js'));

  console.log('\n============================================================');
  console.log('🏆 ALL TEST SUITES PASSED (STATIC + LIVE BACKEND INTEGRATION)');
  console.log('============================================================\n');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});

