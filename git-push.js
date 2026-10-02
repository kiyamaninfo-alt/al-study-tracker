const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getEnvToken() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found.');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/GITHUB_TOKEN\s*=\s*(\S+)/);
  if (!match || !match[1]) {
    console.error('Error: GITHUB_TOKEN not found in .env.');
    process.exit(1);
  }
  return match[1].trim();
}

function getCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
}

function run() {
  const token = getEnvToken();
  const branch = getCurrentBranch();
  const commitMsg = process.argv.slice(2).join(' ').trim();

  try {
    // Stage tracked and untracked files (excluding .gitignore rules like .env)
    execSync('git add -A', { stdio: 'inherit' });

    // Check if there is anything to commit
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (status) {
      const msg = commitMsg || `chore: update tracker (${new Date().toISOString().split('T')[0]})`;
      console.log(`Committing changes: "${msg}"...`);
      execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    } else {
      console.log('No new local changes to commit.');
    }

    // Push using token safely
    console.log(`Pushing branch "${branch}" to GitHub...`);
    const remoteUrl = `https://${token}@github.com/kiyamaninfo-alt/al-study-tracker.git`;
    execSync(`git push ${remoteUrl} ${branch}`, { stdio: 'pipe' });
    try {
      execSync('git fetch origin', { stdio: 'pipe' });
    } catch (_) {}
    console.log(`Successfully pushed to origin/${branch}!`);
  } catch (err) {
    // Sanitize any token leaks from error message
    const sanitizedMsg = (err.stderr ? err.stderr.toString() : err.message || '').replace(new RegExp(token, 'g'), '[REDACTED_TOKEN]');
    console.error('Git push failed:', sanitizedMsg);
    process.exit(1);
  }
}

run();
