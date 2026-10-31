/**
 * CareBridge System — Unified Multi-Service Orchestrator
 * Spawns Backend (5000), Login (3000), Admin Dashboard (5173), Government Dashboard (5174), and Hospital Dashboard (5175).
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

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
    cwd: fs.existsSync(path.join(ROOT_DIR, 'ADMIN_DASHBOARD'))
      ? path.join(ROOT_DIR, 'ADMIN_DASHBOARD')
      : null,
    port: 5173,
  },
  {
    name: 'GOVERNMENT',
    color: '\x1b[36m', // Cyan
    cmd: npmCmd,
    args: ['run', 'dev'],
    cwd: fs.existsSync(path.join(ROOT_DIR, 'GOVERNMENT_DASHBOARD'))
      ? path.join(ROOT_DIR, 'GOVERNMENT_DASHBOARD')
      : null,
    port: 5174,
  },
  {
    name: 'HOSPITAL',
    color: '\x1b[33m', // Yellow
    cmd: npmCmd,
    args: ['run', 'dev'],
    cwd: fs.existsSync(path.join(ROOT_DIR, 'HOSPITAL_DASHBOARD'))
      ? path.join(ROOT_DIR, 'HOSPITAL_DASHBOARD')
      : null,
    port: 5175,
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

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', (error) => {
      if (error.code === 'EADDRINUSE') resolve(false);
      else reject(error);
    });
    probe.once('listening', () => probe.close(() => resolve(true)));
    probe.listen(port);
  });
}

function attachProcessLogging(svc, child) {
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
  child.on('error', (error) => {
    console.error(`${svc.color}[${svc.name}:ERR]${RESET} Failed to start: ${error.message}`);
  });
}

async function startAll() {
  const invalid = services.filter((svc) => !svc.cwd || !fs.existsSync(svc.cwd));
  if (invalid.length) {
    throw new Error(`Missing service directory: ${invalid.map((svc) => svc.name).join(', ')}`);
  }

  const availability = await Promise.all(services.map(async (svc) => ({
    svc,
    available: await isPortAvailable(svc.port)
  })));
  const occupied = availability.filter(({ available }) => !available).map(({ svc }) => `${svc.name}:${svc.port}`);
  if (occupied.length) {
    throw new Error(`Required port(s) already in use: ${occupied.join(', ')}. Stop the existing process before starting dev:all.`);
  }

  services.forEach((svc) => {
    const command = isWindows && svc.cmd === npmCmd ? process.env.ComSpec : svc.cmd;
    const args = isWindows && svc.cmd === npmCmd
      ? ['/d', '/s', '/c', `${svc.cmd} ${svc.args.join(' ')}`]
      : svc.args;
    const child = spawn(command, args, {
      cwd: svc.cwd,
      shell: false,
      env: { ...process.env, PORT: svc.port.toString() },
      windowsHide: true,
    });
    runningProcesses.push({ name: svc.name, process: child });
    attachProcessLogging(svc, child);
  });
}

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

startAll().catch((error) => {
  console.error(`${BOLD}[ORCHESTRATOR:ERR]${RESET} ${error.message}`);
  process.exitCode = 1;
});
