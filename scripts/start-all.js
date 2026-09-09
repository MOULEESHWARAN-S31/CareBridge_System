/**
 * CareBridge System — Unified Multi-Service Orchestrator
 * Spawns Backend (5000), Login (3000), Admin Dashboard (5173), and Government Dashboard (5174).
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = 'node';

const services = [
  {
    name: 'BACKEND',
    color: '\x1b[34m', // Blue
    cmd: npmCmd,
    args: ['run', 'dev'],
    cwd: path.join(ROOT_DIR, 'backend'),
    port: 5000,
  },
  {
    name: 'LOGIN',
    color: '\x1b[32m', // Green
    cmd: nodeCmd,
    args: [path.join(ROOT_DIR, 'scripts', 'serve-login.js')],
    cwd: ROOT_DIR,
    port: 3000,
  },
  {
    name: 'ADMIN',
    color: '\x1b[35m', // Magenta
    cmd: npmCmd,
    args: ['run', 'dev'],
    cwd: path.join(ROOT_DIR, 'admin-dashboard'),
    port: 5173,
  },
  {
    name: 'GOVERNMENT',
    color: '\x1b[36m', // Cyan
    cmd: npmCmd,
    args: ['run', 'dev'],
    cwd: fs.existsSync(path.join(ROOT_DIR, 'Government-dashboard', 'Government website', 'government-dashboard'))
      ? path.join(ROOT_DIR, 'Government-dashboard', 'Government website', 'government-dashboard')
      : path.join(ROOT_DIR, 'Government-dashboard'),
    port: 5174,
  },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}======================================================${RESET}`);
console.log(`${BOLD}       CAREBRIDGE UNIFIED SYSTEM ORCHESTRATOR         ${RESET}`);
console.log(`${BOLD}======================================================${RESET}`);
console.log('Starting all integrated CareBridge modules:\n');
services.forEach((s) => {
  console.log(`  - ${s.color}${BOLD}[${s.name}]${RESET} on http://localhost:${s.port}`);
});
console.log('\nCareBridge Flutter Patient App:');
console.log(`  - run 'npm run dev:carebridge' in a separate terminal to launch on port 8080.\n`);
console.log('Press Ctrl+C to terminate all services.\n');

const runningProcesses = [];

services.forEach((svc) => {
  const child = spawn(svc.cmd, svc.args, {
    cwd: svc.cwd,
    shell: isWindows,
    env: { ...process.env, PORT: svc.port.toString() },
  });

  runningProcesses.push({ name: svc.name, process: child });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${svc.color}[${svc.name}]${RESET} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${svc.color}[${svc.name}:ERR]${RESET} ${line}`);
      }
    });
  });

  child.on('exit', (code, signal) => {
    console.log(`${svc.color}[${svc.name}]${RESET} Process exited with code ${code} (${signal || 'clean'})`);
  });
});

function cleanup() {
  console.log(`\n${BOLD}Shutting down CareBridge System services...${RESET}`);
  runningProcesses.forEach(({ name, process: proc }) => {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t']);
      } else {
        proc.kill('SIGTERM');
      }
    } catch (_) {}
  });
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
