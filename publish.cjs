// publish.js
require('dotenv').config();
if (!process.env.GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN is not set in the environment.');
    process.exit(1);
}
require('child_process').execSync('npx electron-forge publish', { stdio: 'inherit' });
