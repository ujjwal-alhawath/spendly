const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');

const LOCAL_URI = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/spendly';
const ATLAS_URI = process.env.MONGO_URI;

if (!ATLAS_URI) {
  console.error('MONGO_URI is not defined in backend/.env');
  process.exit(1);
}

async function migrate() {
  console.log('--- Starting Data Migration to MongoDB Atlas ---');
  
  // 1. Connect to local
  console.log('Connecting to local MongoDB...');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('✓ Connected to local MongoDB');

  // 2. Connect to Atlas
  console.log('Connecting to MongoDB Atlas...');
  let atlasConn;
  try {
    atlasConn = await mongoose.createConnection(ATLAS_URI, { serverSelectionTimeoutMS: 10000 }).asPromise();
    console.log('✓ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB Atlas:', err.message);
    console.log('\nPlease make sure:');
    console.log('1. In Atlas > Security > Database Access, the user "ujjwalahlawath" has the password updated.');
    console.log('2. In Atlas > Security > Network Access, your IP address or 0.0.0.0/0 is whitelisted.');
    await localConn.close();
    process.exit(1);
  }

  try {
    const collections = ['users', 'expenses'];

    for (const colName of collections) {
      const localCol = localConn.collection(colName);
      const atlasCol = atlasConn.collection(colName);

      const docs = await localCol.find({}).toArray();
      console.log(`Found ${docs.length} documents in local collection "${colName}".`);

      if (docs.length > 0) {
        // Upsert or insert docs without duplicate errors
        for (const doc of docs) {
          await atlasCol.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
        }
        console.log(`✓ Successfully migrated ${docs.length} documents to Atlas collection "${colName}".`);
      }
    }

    console.log('\n--- Migration Completed Successfully! ---');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await localConn.close();
    await atlasConn.close();
    process.exit(0);
  }
}

migrate();

