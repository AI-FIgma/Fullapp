import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure dist directory exists
try {
  mkdirSync('dist', { recursive: true });
} catch (e) {
  // Directory already exists
}

// Files to copy from public to dist
const files = [
  'manifest.json',
  'sw.js',
  'icon.svg',
  'test.txt'
];

console.log('📦 Copying PWA files to dist/...');

files.forEach(file => {
  try {
    copyFileSync(`public/${file}`, `dist/${file}`);
    console.log(`✅ Copied: ${file}`);
  } catch (err) {
    console.error(`❌ Failed to copy ${file}:`, err.message);
  }
});

console.log('✨ PWA files copied successfully!');
