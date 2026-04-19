const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/assets/locales');
const ptDir = path.join(localesDir, 'pt');
const enDir = path.join(localesDir, 'en');

const ptFiles = fs.readdirSync(ptDir).filter(f => f.endsWith('.json'));
const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));

console.log('--- Translation Check ---');

let hasMissing = false;

ptFiles.forEach(file => {
  if (!enFiles.includes(file)) {
    console.error(`Missing file in en: ${file}`);
    hasMissing = true;
    return;
  }

  const pt = JSON.parse(fs.readFileSync(path.join(ptDir, file), 'utf8'));
  const en = JSON.parse(fs.readFileSync(path.join(enDir, file), 'utf8'));

  const ptKeys = Object.keys(pt);
  const enKeys = Object.keys(en);

  const missingInEn = ptKeys.filter(k => !enKeys.includes(k));
  const missingInPt = enKeys.filter(k => !ptKeys.includes(k));

  if (missingInEn.length > 0) {
    console.error(`Missing keys in en/${file}: ${missingInEn.join(', ')}`);
    hasMissing = true;
  }
  if (missingInPt.length > 0) {
    console.error(`Missing keys in pt/${file}: ${missingInPt.join(', ')}`);
    hasMissing = true;
  }
});

if (!hasMissing) {
  console.log('All files and keys match!');
} else {
  console.log('\nSome translations are missing. Please fix them.');
  process.exit(1);
}
