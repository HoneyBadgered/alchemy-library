#!/usr/bin/env node

/**
 * Script to diagnose and fix enum constraint issues in SQLite database
 * 
 * This script helps resolve issues where the status dropdown doesn't show all enum values
 * due to database constraints not matching the schema.json definitions.
 * 
 * ISSUE: When you add text to publishedBody field in Strapi admin, the form refreshes
 * and queries the database for valid enum values. If the database has old constraints,
 * the 'published' option may disappear from the status dropdown.
 * 
 * IMPORTANT: This script only works with SQLite databases and will backup your data.
 * For production PostgreSQL databases, contact your database administrator.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '.tmp', 'data.db');
const BACKUP_PATH = path.join(__dirname, '..', '.tmp', `data.backup.${Date.now()}.db`);

// These values should match the enum definitions in:
// - backend/src/api/grimoire/content-types/grimoire/schema.json
// - backend/src/api/log/content-types/log/schema.json
const EXPECTED_ENUM_VALUES = ['draft', 'pending_ai', 'draft_ready', 'needs_changes', 'published'];
const SCHEMA_PREVIEW_LENGTH = 200; // Characters to show when displaying schema

// Check if better-sqlite3 is available
let sqlite3;
try {
  sqlite3 = require('better-sqlite3');
} catch (error) {
  console.error('\n❌ Error: better-sqlite3 package is not installed.\n');
  console.error('Please install it first:');
  console.error('  npm install better-sqlite3\n');
  console.error('Or run this from the backend directory where it\'s already installed.\n');
  process.exit(1);
}

async function main() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  Enum Constraint Diagnostic Script   ║');
  console.log('╚═══════════════════════════════════════╝\n');

  // Check if database exists
  if (!fs.existsSync(DB_PATH)) {
    console.log('❌ Database not found at:', DB_PATH);
    console.log('ℹ️  Run "npm run develop" first to create the database.');
    process.exit(1);
  }

  console.log('📁 Database found:', DB_PATH);

  // Create backup
  console.log('📦 Creating backup...');
  fs.copyFileSync(DB_PATH, BACKUP_PATH);
  console.log('✅ Backup created:', BACKUP_PATH);

  // Open database
  const db = sqlite3(DB_PATH);

  try {
    // Check current schema
    console.log('\n🔍 Checking current database schema...\n');

    const grimoireSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='grimoires'").get();
    const logSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='logs'").get();

    let issueDetected = false;

    // Analyze grimoire table
    if (grimoireSchema) {
      console.log('📋 Grimoire Table:');
      const sql = grimoireSchema.sql;
      const preview = sql.length > SCHEMA_PREVIEW_LENGTH 
        ? sql.substring(0, SCHEMA_PREVIEW_LENGTH) + '...' 
        : sql;
      console.log(preview + '\n');
      
      // Check if all enum values are in the schema
      const hasAllEnums = EXPECTED_ENUM_VALUES.every(val => sql.includes(`'${val}'`));
      if (!hasAllEnums) {
        console.log('⚠️  WARNING: Grimoire table missing enum values in CHECK constraint!');
        const missing = EXPECTED_ENUM_VALUES.filter(val => !sql.includes(`'${val}'`));
        console.log('   Missing:', missing.join(', '));
        issueDetected = true;
      } else {
        console.log('✅ Grimoire table has all expected enum values');
      }
    }

    // Analyze log table
    if (logSchema) {
      console.log('\n📋 Log Table:');
      const sql = logSchema.sql;
      const preview = sql.length > SCHEMA_PREVIEW_LENGTH 
        ? sql.substring(0, SCHEMA_PREVIEW_LENGTH) + '...' 
        : sql;
      console.log(preview + '\n');
      
      const hasAllEnums = EXPECTED_ENUM_VALUES.every(val => sql.includes(`'${val}'`));
      if (!hasAllEnums) {
        console.log('⚠️  WARNING: Log table missing enum values in CHECK constraint!');
        const missing = EXPECTED_ENUM_VALUES.filter(val => !sql.includes(`'${val}'`));
        console.log('   Missing:', missing.join(', '));
        issueDetected = true;
      } else {
        console.log('✅ Log table has all expected enum values');
      }
    }

    // Check existing status values in data
    console.log('\n📊 Checking existing status values in data...\n');

    try {
      const grimoireStatuses = db.prepare("SELECT DISTINCT status FROM grimoires").all();
      console.log('Grimoire statuses in use:', grimoireStatuses.map(r => r.status).join(', ') || 'none');
    } catch (e) {
      console.log('ℹ️  No grimoires data yet');
    }

    try {
      const logStatuses = db.prepare("SELECT DISTINCT status FROM logs").all();
      console.log('Log statuses in use:', logStatuses.map(r => r.status).join(', ') || 'none');
    } catch (e) {
      console.log('ℹ️  No logs data yet');
    }

    console.log('\n' + '═'.repeat(60));

    if (issueDetected) {
      console.log('\n❌ ISSUE DETECTED!\n');
      console.log('Your database constraints are missing some enum values.');
      console.log('This is why the "published" option disappears from the status');
      console.log('dropdown after editing fields in the Strapi admin panel.\n');
      console.log('🔧 SOLUTION:\n');
      console.log('Since SQLite doesn\'t support altering enum constraints directly,');
      console.log('you need to recreate the database:\n');
      console.log('   1. Export your data (if you have important content)');
      console.log('   2. Run: npm run reset-db');
      console.log('   3. Run: npm run clear-cache');
      console.log('   4. Run: npm run develop');
      console.log('   5. Recreate your admin user');
      console.log('   6. Import your data back (if needed)\n');
      console.log('📦 Your current database is backed up at:');
      console.log('   ' + BACKUP_PATH);
    } else {
      console.log('\n✅ NO ISSUES DETECTED!\n');
      console.log('All expected enum values are present in the database schema.');
      console.log('If you\'re still experiencing issues with the status dropdown:');
      console.log('   1. Clear your browser cache');
      console.log('   2. Restart Strapi');
      console.log('   3. Check the browser console for JavaScript errors');
    }

  } catch (error) {
    console.error('\n❌ Error during diagnostic:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

main().catch(console.error);
