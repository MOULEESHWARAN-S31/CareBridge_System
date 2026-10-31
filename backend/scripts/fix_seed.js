const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../../CARE_BRIDGE/lib/l10n/seed_translations.json');
const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

data.en.loginPrivacyNote = "We'll use your mobile number to securely verify your identity.";
data.ta.loginPrivacyNote = "உங்கள் அடையாளத்தை சரிபார்க்க மட்டுமே கைபேசி எண் பயன்படுத்தப்படும்.";
data.hi.loginPrivacyNote = "आपकी पहचान सत्यापित करने के लिए ही मोबाइल नंबर का उपयोग किया जाएगा।";

// Clean up any extra newlines or quotes in all keys
for (const lang of Object.keys(data)) {
  for (const [k, v] of Object.entries(data[lang])) {
    if (typeof v === 'string') {
      data[lang][k] = v.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }
}

fs.writeFileSync(seedPath, JSON.stringify(data, null, 2), 'utf8');
console.log('[✓] Cleaned seed_translations.json');
