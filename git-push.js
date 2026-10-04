const fs = require('fs');
const path = require('path');
const https = require('https');
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

function githubApiRequest(method, endpoint, token, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'User-Agent': 'NodeJS-Git-Push',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const errDetails = Array.isArray(parsed.errors)
              ? parsed.errors.map(e => e.message || JSON.stringify(e)).join('; ')
              : '';
            const fullMsg = [parsed.message, errDetails].filter(Boolean).join(': ');
            reject(new Error(fullMsg || `HTTP ${res.statusCode}`));
          }
        } catch (e) {
          resolve({});
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  const token = getEnvToken();
  const branch = getCurrentBranch();
  const commitMsg = process.argv.slice(2).join(' ').trim();

  try {
    // Stage tracked and untracked files (excluding .gitignore rules like .env)
    execSync('git add -A', { stdio: 'inherit' });

    // Check if there is anything to commit
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    let msg = commitMsg || `chore: update tracker (${new Date().toISOString().split('T')[0]})`;
    if (status) {
      console.log(`Committing changes: "${msg}"...`);
      execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    } else {
      console.log('No new local changes to commit.');
    }

    // Push using token safely
    console.log(`Pushing branch "${branch}" to GitHub...`);
    const remoteUrl = `https://${token}@github.com/kiyamaninfo-alt/al-study-tracker.git`;
    
    try {
      execSync(`git push ${remoteUrl} ${branch}`, { stdio: 'pipe' });
      try {
        execSync('git fetch origin', { stdio: 'pipe' });
      } catch (_) {}
      console.log(`Successfully pushed to origin/${branch}!`);

      if (branch !== 'main') {
        console.log(`Creating PR from "${branch}" into "main" and merging...`);
        let pr;
        try {
          pr = await githubApiRequest('POST', '/repos/kiyamaninfo-alt/al-study-tracker/pulls', token, {
            title: msg,
            head: branch,
            base: 'main',
            body: `Automated sync from ${branch}.`
          });
        } catch (prErr) {
          if (prErr.message && prErr.message.includes('A pull request already exists')) {
            const openPrs = await githubApiRequest('GET', `/repos/kiyamaninfo-alt/al-study-tracker/pulls?head=kiyamaninfo-alt:${branch}&state=open`, token);
            if (Array.isArray(openPrs) && openPrs.length > 0) {
              pr = openPrs[0];
            }
          } else if (prErr.message && prErr.message.includes('No commits between')) {
            console.log('No new commits between branch and main. Main is already up to date.');
          } else {
            throw prErr;
          }
        }

        if (pr && pr.number) {
          console.log(`Pull Request #${pr.number} created/found. Merging into main...`);
          await githubApiRequest('PUT', `/repos/kiyamaninfo-alt/al-study-tracker/pulls/${pr.number}/merge`, token, {
            commit_title: `${msg} (#${pr.number})`,
            merge_method: 'merge'
          });
          console.log(`Pull Request #${pr.number} merged into main!`);
          try {
            execSync('git fetch origin', { stdio: 'pipe' });
            execSync('git branch -f main origin/main', { stdio: 'pipe' });
            console.log('Local main branch fast-forwarded to origin/main.');
          } catch (_) {}
        }
      }
    } catch (pushErr) {
      const errStr = pushErr.stderr ? pushErr.stderr.toString() : pushErr.message || '';
      if (branch === 'main' && (errStr.includes('GH013') || errStr.includes('pull request') || errStr.includes('rule violations'))) {
        console.log('Main branch protection active (PR required). Creating sync branch & auto-merging PR...');
        const syncBranch = `phase-sync-${Date.now()}`;
        execSync(`git push ${remoteUrl} main:${syncBranch} --force`, { stdio: 'pipe' });
        
        const pr = await githubApiRequest('POST', '/repos/kiyamaninfo-alt/al-study-tracker/pulls', token, {
          title: msg,
          head: syncBranch,
          base: 'main',
          body: 'Auto-sync from local development.'
        });
        
        if (pr && pr.number) {
          console.log(`Pull Request #${pr.number} created. Merging into main...`);
          await githubApiRequest('PUT', `/repos/kiyamaninfo-alt/al-study-tracker/pulls/${pr.number}/merge`, token, {
            commit_title: `${msg} (#${pr.number})`,
            merge_method: 'merge'
          });
          console.log(`Pull Request #${pr.number} merged into main!`);
          execSync('git pull origin main', { stdio: 'pipe' });
          console.log(`Successfully pushed and merged to origin/main!`);
        }
      } else {
        throw pushErr;
      }
    }
  } catch (err) {
    // Sanitize any token leaks from error message
    const sanitizedMsg = (err.stderr ? err.stderr.toString() : err.message || '').replace(new RegExp(token, 'g'), '[REDACTED_TOKEN]');
    console.error('Git push failed:', sanitizedMsg);
    process.exit(1);
  }
}

run();
