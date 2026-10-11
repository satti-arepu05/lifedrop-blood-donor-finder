import db from './config/db.js';

const table = process.argv[2] || 'all';

console.log('====================================================');
console.log('🗄️  LifeDrop SQLite Database Viewer');
console.log('📍 File: server/data/lifedrop.db');
console.log('====================================================\n');

if (table === 'all' || table === 'summary') {
  const tables = ['users', 'donors', 'requests', 'request_matches', 'notifications', 'contact_messages'];
  console.log('📊 TABLES SUMMARY:\n');
  const summary = tables.map(t => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${t}`).get().count;
    return { 'Table Name': t, 'Row Count': count };
  });
  console.table(summary);
  console.log('\n💡 Tip: Run `npm --prefix server run db:view <table_name>` to view rows.');
  console.log('   Example: `npm --prefix server run db:view donors`\n');
}

if (table !== 'all' && table !== 'summary') {
  try {
    const rows = db.prepare(`SELECT * FROM ${table} LIMIT 25`).all();
    console.log(`📋 Rows in table '${table}' (first 25):\n`);
    console.table(rows);
  } catch (err) {
    console.error(`Error querying table '${table}':`, err.message);
  }
}
