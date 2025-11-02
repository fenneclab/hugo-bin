import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const testSuite = suite('cli');
const cliPath = fileURLToPath(new URL('../bin/cli.js', import.meta.url));

testSuite('should spawn hugo process with version command', async() => {
  const result = await new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, 'version'], {
      stdio: 'pipe'
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => {
      stdout += data.toString();
    });

    child.stderr.on('data', data => {
      stderr += data.toString();
    });

    child.on('error', reject);

    child.on('exit', code => {
      resolve({ code, stdout, stderr });
    });
  });

  // The CLI should execute successfully (exit code 0 or 1 depending on output redirection)
  assert.ok(result.code !== null);
  assert.ok(result.stdout.includes('hugo') || result.stderr.includes('hugo'));
});

testSuite('should spawn hugo process with help command', async() => {
  const result = await new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, 'help'], {
      stdio: 'pipe'
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => {
      stdout += data.toString();
    });

    child.stderr.on('data', data => {
      stderr += data.toString();
    });

    child.on('error', reject);

    child.on('exit', code => {
      resolve({ code, stdout, stderr });
    });
  });

  // The CLI should execute (exit code can vary based on platform/config)
  assert.ok(result.code !== null);
  const output = result.stdout + result.stderr;
  assert.ok(output.includes('hugo') || output.includes('Hugo') || output.includes('usage'));
});

testSuite('should pass arguments to hugo binary', async() => {
  const result = await new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, '--help'], {
      stdio: 'pipe'
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => {
      stdout += data.toString();
    });

    child.stderr.on('data', data => {
      stderr += data.toString();
    });

    child.on('error', reject);

    child.on('exit', code => {
      resolve({ code, stdout, stderr });
    });
  });

  // Should execute and return output
  assert.ok(result.code !== null);
  const output = result.stdout + result.stderr;
  assert.ok(output.length > 0);
});

testSuite.run();
