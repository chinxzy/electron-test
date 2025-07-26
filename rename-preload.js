// rename-preload.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const from = path.join(__dirname, 'dist-electron', 'preload.js');
const to = path.join(__dirname, 'dist-electron', 'preload.cjs');

try {
    if (fs.existsSync(from)) {
        fs.renameSync(from, to);
        console.log('✅ Renamed preload.js to preload.cjs');
    } else {
        console.warn('⚠️ preload.js does not exist, skipping rename');
    }
} catch (err) {
    console.error('❌ Failed to rename preload.js to preload.cjs:', err);
    process.exit(1);
}