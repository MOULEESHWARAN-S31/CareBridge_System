const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const {
  DOCTOR_TRANSLITERATIONS,
  SPECIALIZATION_TRANSLATIONS,
  HOSPITAL_TRANSLATIONS
} = require('../src/services/translationDbService');

async function migrate() {
  console.log('===========================================================');
  console.log(' CareBridge Multilingual Schema Migration (All 23 Locales)');
  console.log('===========================================================');

  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/carebridge_db';
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('[✓] Connected to PostgreSQL.');

    // 1. Create entity_translations table
    console.log('Creating entity_translations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS entity_translations (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        field_name VARCHAR(50) NOT NULL,
        locale VARCHAR(10) NOT NULL,
        translated_value TEXT NOT NULL,
        translation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
        reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_entity_translation UNIQUE (entity_type, entity_id, field_name, locale)
      );

      CREATE INDEX IF NOT EXISTS idx_entity_trans_lookup 
        ON entity_translations (entity_type, entity_id, locale);
      CREATE INDEX IF NOT EXISTS idx_entity_trans_locale 
        ON entity_translations (locale);
    `);
    console.log('[✓] entity_translations table and indexes ready.');

    // 2. Seed Doctor Name Translations
    let docCount = 0;
    for (const [docId, data] of Object.entries(DOCTOR_TRANSLITERATIONS)) {
      if (data.name) {
        for (const [locale, val] of Object.entries(data.name)) {
          await client.query(`
            INSERT INTO entity_translations (entity_type, entity_id, field_name, locale, translated_value, translation_status)
            VALUES ('doctor', $1, 'name', $2, $3, 'APPROVED')
            ON CONFLICT (entity_type, entity_id, field_name, locale)
            DO UPDATE SET translated_value = EXCLUDED.translated_value;
          `, [docId, locale, val]);
          docCount++;
        }
      }
    }
    console.log(`[✓] Seeded ${docCount} doctor name translations.`);

    // 3. Seed Specialization Translations
    let specCount = 0;
    for (const [spec, translations] of Object.entries(SPECIALIZATION_TRANSLATIONS)) {
      for (const [locale, val] of Object.entries(translations)) {
        await client.query(`
          INSERT INTO entity_translations (entity_type, entity_id, field_name, locale, translated_value, translation_status)
          VALUES ('specialization', $1, 'name', $2, $3, 'APPROVED')
          ON CONFLICT (entity_type, entity_id, field_name, locale)
          DO UPDATE SET translated_value = EXCLUDED.translated_value;
        `, [spec, locale, val]);
        specCount++;
      }
    }
    console.log(`[✓] Seeded ${specCount} specialization translations.`);

    // 4. Seed Hospital Translations
    let hospCount = 0;
    for (const [hospId, data] of Object.entries(HOSPITAL_TRANSLATIONS)) {
      if (data.name) {
        for (const [locale, val] of Object.entries(data.name)) {
          await client.query(`
            INSERT INTO entity_translations (entity_type, entity_id, field_name, locale, translated_value, translation_status)
            VALUES ('hospital', $1, 'name', $2, $3, 'APPROVED')
            ON CONFLICT (entity_type, entity_id, field_name, locale)
            DO UPDATE SET translated_value = EXCLUDED.translated_value;
          `, [hospId, locale, val]);
          hospCount++;
        }
      }
    }
    console.log(`[✓] Seeded ${hospCount} hospital translations.`);

    console.log('\n===========================================================');
    console.log(' [✓] Multilingual Database Migration Succeeded!');
    console.log('===========================================================');
  } catch (err) {
    console.error('[✗] Multilingual migration error:', err.message);
  } finally {
    try { await client.end(); } catch (_) {}
  }
}

migrate();
