const bcrypt = require('bcryptjs');
const { connectToDatabase } = require('./db');

const COLLECTION = 'users';
const SALT_ROUNDS = 10;

// Fields returned to the client (never expose the password hash)
function toPublicUser(userDoc) {
  if (!userDoc) return null;
  const { password, ...publicUser } = userDoc;
  return publicUser;
}

async function getUsersCollection() {
  const db = await connectToDatabase();
  return db.collection(COLLECTION);
}

async function findUserByEmail(email) {
  const users = await getUsersCollection();
  return users.findOne({ email: email.toLowerCase() });
}

async function findUserById(id) {
  const { ObjectId } = require('mongodb');
  const users = await getUsersCollection();
  return users.findOne({ _id: new ObjectId(id) });
}

async function createUser({ firstName, lastName, email, password }) {
  const users = await getUsersCollection();
  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error('A user with this email already exists');
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const now = new Date();

  const newUser = {
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  };

  const result = await users.insertOne(newUser);
  return toPublicUser({ ...newUser, _id: result.insertedId });
}

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

async function updateUser(id, updates) {
  const { ObjectId } = require('mongodb');
  const users = await getUsersCollection();

  const allowedFields = ['firstName', 'lastName', 'email'];
  const sanitizedUpdates = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      sanitizedUpdates[field] = field === 'email'
        ? updates[field].toLowerCase()
        : updates[field];
    }
  }

  if (updates.password) {
    sanitizedUpdates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
  }

  sanitizedUpdates.updatedAt = new Date();

  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: sanitizedUpdates },
    { returnDocument: 'after' }
  );

  return toPublicUser(result.value || result);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  updateUser,
  toPublicUser
};
