const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');
console.log(`Starting backend in: ${backendDir}`);

const uvicorn = spawn('py', ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000'], {
    cwd: backendDir,
    env: { ...process.env, PYTHONPATH: '.' }
});

uvicorn.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
});

uvicorn.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
});

uvicorn.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
});

// Start the Node server as well if not already running
// (Though npm run dev is likely already running)

console.log('Servers are being initialized...');
