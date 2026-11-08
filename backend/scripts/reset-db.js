const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/spendly';
const ATLAS_URI = process.env.MONGO_URI;

async function clearDatabase(uri, label) {
  console.log(`\n--- Connecting to ${label} ---`);
  try {
    const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 5000 }).asPromise();
    const db = conn.db;

    const uBefore = await db.collection('users').countDocuments();
    const eBefore = await db.collection('expenses').countDocuments();
    console.log(`Found before cleanup: ${uBefore} users, ${eBefore} expenses.`);

    const userRes = await db.collection('users').deleteMany({});
    const expRes = await db.collection('expenses').deleteMany({});

    console.log(`✓ Deleted ${userRes.deletedCount} users from ${label}.`);
    console.log(`✓ Deleted ${expRes.deletedCount} expenses from ${label}.`);

    const uAfter = await db.collection('users').countDocuments();
    const eAfter = await db.collection('expenses').countDocuments();
    console.log(`Remaining in ${label}: ${uAfter} users, ${eAfter} expenses. (Clean Slate)`);

    await conn.close();
    return true;
  } catch (err) {
    console.error(`✗ Failed to clear ${label}:`, err.message);
    return false;
  }
}

async function runReset() {
  console.log('====================================================');
  console.log('RESETTING DATABASE: Removing all previous users & data');
  console.log('====================================================');

  // 1. Clear Local MongoDB
  await clearDatabase(LOCAL_URI, 'Local MongoDB (mongodb://127.0.0.1:27017/spendly)');

  // 2. Clear MongoDB Atlas if URI is provided
  if (ATLAS_URI && ATLAS_URI !== LOCAL_URI) {
    const atlasSuccess = await clearDatabase(ATLAS_URI, 'MongoDB Atlas Cluster');
    if (!atlasSuccess) {
      console.log('\nNotice: If Atlas was not reachable due to IP whitelisting:');
      console.log('Once you whitelist 0.0.0.0/0 in Atlas Security > Network Access,');
      console.log('you can run "npm run db:reset" anytime to clean Atlas as well.');
    }
  }

  console.log('\n====================================================');
  console.log('✓ Database reset operation complete!');
  console.log('====================================================');
  process.exit(0);
}

runReset();

