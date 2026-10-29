const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

async function runTests() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spendly';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for testing.');

  const server = app.listen(5002);
  const BASE_URL = 'http://localhost:5002/api';

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName} ${detail}`);
      failed++;
    }
  }

  try {
    // 0. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok' && healthData.mongodb === 'connected', 'Health check endpoint returns 200 and connected');

    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';

    // 1. Signup with valid data
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '  Test User  ', email: `  ${testEmail}  `, password: testPassword }),
    });
    const signupData = await signupRes.json();
    assert(signupRes.status === 201 && signupData.token && signupData.user.email === testEmail.toLowerCase(), 'Signup trims email and name and returns 201');

    const token = signupData.token;

    // 2. Signup duplicate email
    const dupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dup User', email: testEmail.toUpperCase(), password: testPassword }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 400 && dupData.message === 'User already exists', 'Case-insensitive duplicate signup rejected with 400 JSON');

    // 3. Signup missing password
    const emptySignupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'No Pass', email: `empty_${Date.now()}@test.com` }),
    });
    const emptySignupData = await emptySignupRes.json().catch(() => null);
    assert(emptySignupRes.status === 400 && emptySignupData.message, 'Signup with missing password rejected with 400 JSON');

    // 4. Login with case-insensitive / trimmed email
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `  ${testEmail.toUpperCase()}  `, password: testPassword }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token, 'Login with uppercase/whitespace email succeeds');

    // 5. Login with invalid password
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'wrongpassword' }),
    });
    const badLoginData = await badLoginRes.json();
    assert(badLoginRes.status === 400 && badLoginData.message === 'Invalid credentials', 'Login wrong password rejected with 400 JSON');

    // 6. Login with non-existent email
    const nonUserRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent_user_9999@test.com', password: 'password123' }),
    });
    const nonUserData = await nonUserRes.json();
    assert(nonUserRes.status === 400 && nonUserData.message === 'Invalid credentials', 'Login non-existent user rejected with 400 JSON');

    // 7. Get /auth/me with token
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.email === testEmail.toLowerCase(), 'Protected /auth/me with token');

    // 8. Get /auth/me without token
    const noTokenRes = await fetch(`${BASE_URL}/auth/me`);
    const noTokenData = await noTokenRes.json();
    assert(noTokenRes.status === 401 && noTokenData.message, 'Protected /auth/me without token returns 401 JSON');

    // 9. Upgrade premium
    const upgradeRes = await fetch(`${BASE_URL}/auth/upgrade-premium`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isPremium: true }),
    });
    const upgradeData = await upgradeRes.json();
    assert(upgradeRes.status === 200 && upgradeData.user.isPremium === true, 'Upgrade premium to true');

    // 10. Create Expense
    const createExpRes = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Office Coffee',
        amount: 250,
        category: 'Food',
        type: 'expense',
        date: '2026-10-29',
        note: 'Starbucks',
      }),
    });
    const expData = await createExpRes.json();
    assert(createExpRes.status === 201 && expData.id && expData.amount === 250, 'Create expense returns 201');

    const createdId = expData.id;

    // 11. Create Income
    const createIncRes = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Consulting Fee',
        amount: 15000,
        category: 'Freelance',
        type: 'income',
        date: '2026-10-29',
      }),
    });
    const incData = await createIncRes.json();
    assert(createIncRes.status === 201 && incData.type === 'income', 'Create income returns 201');

    // 12. Create Expense with missing/invalid fields
    const badExpRes1 = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Invalid' }),
    });
    assert(badExpRes1.status === 400, 'Create expense missing amount returns 400');

    const badExpRes2 = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Invalid', amount: -50, category: 'Food' }),
    });
    assert(badExpRes2.status === 400, 'Create expense negative amount returns 400');

    // 13. Get all expenses
    const getExpRes = await fetch(`${BASE_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allExpenses = await getExpRes.json();
    assert(getExpRes.status === 200 && Array.isArray(allExpenses) && allExpenses.length >= 2, 'Get all expenses returns array');

    // 14. Update expense
    const updateExpRes = await fetch(`${BASE_URL}/expenses/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Artisan Coffee', amount: 300 }),
    });
    const updatedExp = await updateExpRes.json();
    assert(updateExpRes.status === 200 && updatedExp.title === 'Artisan Coffee' && updatedExp.amount === 300, 'Update expense');

    // 15. Update expense with non-ObjectId string (e.g. invalid client ID)
    const badIdUpdateRes = await fetch(`${BASE_URL}/expenses/non-object-id-string`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test' }),
    });
    assert(badIdUpdateRes.status === 404, 'Update expense invalid ID returns 404 (not 500)', `Got status ${badIdUpdateRes.status}`);

    // 16. User Isolation Check: Create User 2 and ensure cannot access User 1's expense
    const user2Email = `user2_${Date.now()}@test.com`;
    const signup2Res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Two', email: user2Email, password: 'password123' }),
    });
    const signup2Data = await signup2Res.json();
    const token2 = signup2Data.token;

    // User 2 tries to update User 1's expense
    const stealUpdateRes = await fetch(`${BASE_URL}/expenses/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token2}` },
      body: JSON.stringify({ title: 'Hacked Coffee' }),
    });
    assert(stealUpdateRes.status === 401, 'User 2 cannot update User 1 transaction (returns 401)');

    // User 2 tries to delete User 1's expense
    const stealDeleteRes = await fetch(`${BASE_URL}/expenses/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token2}` },
    });
    assert(stealDeleteRes.status === 401, 'User 2 cannot delete User 1 transaction (returns 401)');

    // 17. Delete expense by ID
    const delRes = await fetch(`${BASE_URL}/expenses/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(delRes.status === 200, 'Delete expense by ID returns 200');

    // 18. Delete expense with invalid ID
    const badIdDelRes = await fetch(`${BASE_URL}/expenses/non-object-id-string`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(badIdDelRes.status === 404, 'Delete expense invalid ID returns 404 (not 500)', `Got status ${badIdDelRes.status}`);

    // 19. Clear all expenses for user
    const clearRes = await fetch(`${BASE_URL}/expenses`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(clearRes.status === 200, 'Clear all expenses returns 200');

    // Verify empty
    const verifyRes = await fetch(`${BASE_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const verifyData = await verifyRes.json();
    assert(Array.isArray(verifyData) && verifyData.length === 0, 'Verify all expenses cleared');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    await mongoose.disconnect();
    console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
