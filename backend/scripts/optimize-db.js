const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

async function optimize() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI is missing in backend/.env');
    process.exit(1);
  }

  console.log('--- Starting MongoDB Atlas Storage Optimization ---');
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // 1. Initial Stats
  const beforeStats = await db.stats();
  console.log('\n[Before Optimization]');
  console.log(`- Data Size:    ${(beforeStats.dataSize / 1024).toFixed(2)} KB`);
  console.log(`- Storage Size: ${(beforeStats.storageSize / 1024).toFixed(2)} KB`);
  console.log(`- Index Size:   ${(beforeStats.indexSize / 1024).toFixed(2)} KB`);
  console.log(`- Total Size:   ${((beforeStats.storageSize + beforeStats.indexSize) / 1024).toFixed(2)} KB`);

  // 2. Remove orphaned/dummy test users
  const deleteTestUsers = await db.collection('users').deleteMany({
    email: { $regex: /^(test_|user2_|empty_)/i },
  });
  console.log(`\n✓ Cleaned up ${deleteTestUsers.deletedCount} orphaned test accounts.`);

  // 3. Remove __v (versionKey) from all existing documents to reduce BSON size
  const userUnset = await db.collection('users').updateMany({}, { $unset: { __v: '' } });
  const expenseUnset = await db.collection('expenses').updateMany({}, { $unset: { __v: '' } });
  console.log(`✓ Stripped unnecessary __v fields (${userUnset.modifiedCount} users, ${expenseUnset.modifiedCount} expenses).`);

  // 4. Optimize Indexes
  const expenseIndexes = await db.collection('expenses').indexes();
  const hasOldSingleUserIndex = expenseIndexes.some(ix => ix.name === 'user_1');
  if (hasOldSingleUserIndex) {
    await db.collection('expenses').dropIndex('user_1');
    console.log('✓ Dropped redundant single-field index "user_1" on expenses.');
  }

  // Ensure compound index { user: 1, date: -1 } exists
  await db.collection('expenses').createIndex({ user: 1, date: -1 }, { background: true });
  console.log('✓ Ensured compact compound index { user: 1, date: -1 } on expenses.');

  // 5. Final Stats & Summary
  const afterStats = await db.stats();
  const remainingUsers = await db.collection('users').countDocuments();
  const remainingExpenses = await db.collection('expenses').countDocuments();

  console.log('\n[After Optimization]');
  console.log(`- Active Users:      ${remainingUsers}`);
  console.log(`- Active Expenses:   ${remainingExpenses}`);
  console.log(`- Data Size:         ${(afterStats.dataSize / 1024).toFixed(2)} KB`);
  console.log(`- Storage Size:      ${(afterStats.storageSize / 1024).toFixed(2)} KB`);
  console.log(`- Index Size:        ${(afterStats.indexSize / 1024).toFixed(2)} KB`);
  console.log(`- Total Atlas Size:  ${((afterStats.storageSize + afterStats.indexSize) / 1024).toFixed(2)} KB / 512 MB Free Limit`);

  await mongoose.disconnect();
  console.log('\n--- Optimization Complete! ---');
}

optimize().catch((err) => {
  console.error('Optimization failed:', err);
  process.exit(1);
});

