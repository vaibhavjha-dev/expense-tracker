const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'src', 'messages');
const languages = ['en', 'de', 'es', 'fr', 'hi'];

// Helper to flatten object keys
const flattenKeys = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flattenKeys(obj[k], pre + k));
        } else {
            acc[pre + k] = true;
        }
        return acc;
    }, {});
};

// Load and parse a JSON file
const loadParams = (lang) => {
    try {
        const filePath = path.join(messagesDir, `${lang}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return {};
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (e) {
        console.error(`Error loading ${lang}.json:`, e.message);
        return {};
    }
};

console.log('Starting translation comparison...\n');

// Load English keys as the baseline
const enData = loadParams('en');
const enKeys = Object.keys(flattenKeys(enData));

if (enKeys.length === 0) {
    console.error('Error: No keys found in en.json or file failed to load.');
    process.exit(1);
}

let hasErrors = false;

// Compare other languages against English
languages.filter(l => l !== 'en').forEach(lang => {
    const langData = loadParams(lang);
    const langKeys = Object.keys(flattenKeys(langData));

    const missing = enKeys.filter(k => !langKeys.includes(k));

    if (missing.length > 0) {
        hasErrors = true;
        console.log(`❌ Missing keys in ${lang}.json:`);
        missing.forEach(k => console.log(`   - ${k}`));
    } else {
        console.log(`✅ ${lang}.json is complete.`);
    }
});

if (!hasErrors) {
    console.log('\nAll translation files are in sync!');
} else {
    console.log('\nSome translation files are missing keys.');
}
