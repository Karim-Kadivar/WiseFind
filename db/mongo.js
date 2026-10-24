import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { INITIAL_PRODUCTS } from "../src/data/mockData.js";

let INITIAL_BUYING_GUIDES = [];
try {
  const guidesFile = path.join(process.cwd(), "db_storage", "guides.json");
  if (fs.existsSync(guidesFile)) {
    INITIAL_BUYING_GUIDES = JSON.parse(fs.readFileSync(guidesFile, "utf-8"));
  }
} catch (e) {
  INITIAL_BUYING_GUIDES = [];
}

const DEFAULT_ACCOUNTS = [
  {
    name: 'Ankit Sharma',
    email: 'customer@wisefind.com',
    password: 'Customer@123',
    role: 'user',
    createdAt: new Date().toISOString()
  },
  {
    name: 'Vikramaditya Sengupta',
    email: 'advisor@wisefind.com',
    password: 'Advisor@123',
    role: 'expert',
    advisorCategory: 'Laptops & Workstations',
    advisorExperience: '10',
    createdAt: new Date().toISOString()
  },
  {
    name: 'Karim Kadivar',
    email: 'admin@wisefind.com',
    password: 'Admin@123',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_INQUIRIES = [
  {
    id: 'req-sample-1',
    customerName: 'Rohit Sharma',
    customerEmail: 'rohit.s@example.com',
    category: 'Electronics & Gadgets',
    productName: 'Samsung Galaxy S24 Ultra',
    message: 'Should I buy S24 Ultra now on Flipkart with Axis 5% cashback or wait for Diwali sale?',
    timestamp: '2 hours ago',
    status: 'pending',
    reply: null,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'req-sample-2',
    customerName: 'Priya Mehra',
    customerEmail: 'priya.m@techcorp.in',
    category: 'Laptops',
    productName: 'MacBook Air M3 vs Dell XPS 13',
    message: 'Need a machine for intensive Docker and React Native development. Will 16GB Air M3 throttle?',
    timestamp: 'Yesterday',
    status: 'replied',
    reply: 'For Docker containers, 16GB unified memory is the bare minimum. Air M3 is fanless so under 30min builds it will throttle ~15%. Suggest 16GB Pro M3 or Dell XPS 16GB with active fans.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const DEFAULT_WISELISTS = {
  'customer@wisefind.com': [
    { id: 'default', name: 'My Tech WiseList', description: 'Primary tracking list', productIds: ['phone-1', 'laptop-1'] }
  ],
  'admin@wisefind.com': [
    { id: 'default', name: 'Admin Benchmark WiseList', description: 'Catalog benchmark items', productIds: ['phone-2', 'headphone-1'] }
  ]
};

/**
 * Official MongoDB Database Connection & Collection Manager
 * Built strictly with Node.js & modern JavaScript (ES Modules).
 */

const DEFAULT_MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wisefind";
const DB_NAME = process.env.MONGODB_DB_NAME || "wisefind";

let client = null;
let database = null;
let isConnected = false;
let connectionError = null;

// Backup in-memory cache synchronized with MongoDB for seamless offline resilience
let memoryProducts = [...INITIAL_PRODUCTS];
let memoryGuides = [...INITIAL_BUYING_GUIDES];
let memoryInquiries = [...DEFAULT_INQUIRIES];
let memoryUsers = [...DEFAULT_ACCOUNTS];
let memoryWiseLists = { ...DEFAULT_WISELISTS };

const dbDir = path.join(process.cwd(), "db_storage");
const backupProductsPath = path.join(dbDir, "products.json");
const backupGuidesPath = path.join(dbDir, "guides.json");
const backupUsersPath = path.join(dbDir, "users.json");
const backupInquiriesPath = path.join(dbDir, "inquiries.json");
const backupWiseListsPath = path.join(dbDir, "wiselists.json");

// Ensure backup storage directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Pre-load from disk if exists
try {
  if (fs.existsSync(backupProductsPath)) {
    const raw = fs.readFileSync(backupProductsPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) memoryProducts = parsed;
  }
} catch (e) {
  console.warn("[MongoDB Manager] Warning reading backup products file:", e.message);
}

try {
  if (fs.existsSync(backupGuidesPath)) {
    const raw = fs.readFileSync(backupGuidesPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) memoryGuides = parsed;
  }
} catch (e) {
  console.warn("[MongoDB Manager] Warning reading backup guides file:", e.message);
}

try {
  if (fs.existsSync(backupUsersPath)) {
    const raw = fs.readFileSync(backupUsersPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryUsers = parsed;
      for (const def of DEFAULT_ACCOUNTS) {
        if (!memoryUsers.some(u => u.email?.toLowerCase() === def.email.toLowerCase())) {
          memoryUsers.push(def);
        }
      }
    }
  }
} catch (e) {
  console.warn("[MongoDB Manager] Warning reading backup users file:", e.message);
}

try {
  if (fs.existsSync(backupInquiriesPath)) {
    const raw = fs.readFileSync(backupInquiriesPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) memoryInquiries = parsed;
  }
} catch (e) {
  console.warn("[MongoDB Manager] Warning reading backup inquiries file:", e.message);
}

try {
  if (fs.existsSync(backupWiseListsPath)) {
    const raw = fs.readFileSync(backupWiseListsPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') memoryWiseLists = parsed;
  }
} catch (e) {
  console.warn("[MongoDB Manager] Warning reading backup wiselists file:", e.message);
}

/**
 * Initialize MongoDB connection and verify collections
 */
export async function initMongoDatabase() {
  const maskedUri = DEFAULT_MONGODB_URI.replace(/:([^:@]{4,})@/, ":****@");
  console.log(`[MongoDB] Initializing connection to: ${maskedUri}...`);

  try {
    client = new MongoClient(DEFAULT_MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });

    await client.connect();
    database = client.db(DB_NAME);
    isConnected = true;
    connectionError = null;

    console.log(`[MongoDB] Successfully connected to database: "${DB_NAME}".`);

    const productsCollection = database.collection("products");
    const guidesCollection = database.collection("guides");
    const inquiriesCollection = database.collection("inquiries");
    const usersCollection = database.collection("users");
    const wiselistsCollection = database.collection("wiselists");

    // Indexes
    await productsCollection.createIndex({ id: 1 }, { unique: true, background: true });
    await productsCollection.createIndex({ category: 1, brand: 1, price: 1 }, { background: true });
    await guidesCollection.createIndex({ id: 1 }, { unique: true, background: true });
    await inquiriesCollection.createIndex({ id: 1 }, { unique: true, background: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true, background: true });
    await wiselistsCollection.createIndex({ email: 1 }, { unique: true, background: true });

    // Seed / Sync Initial Products into MongoDB
    const existingCount = await productsCollection.countDocuments();
    if (existingCount === 0) {
      console.log(`[MongoDB] Seeding ${INITIAL_PRODUCTS.length} initial products into MongoDB...`);
      await productsCollection.insertMany(INITIAL_PRODUCTS);
    } else {
      for (const prod of INITIAL_PRODUCTS) {
        await productsCollection.updateOne(
          { id: prod.id },
          { $set: prod },
          { upsert: true }
        );
      }
    }

    // Seed Guides into MongoDB
    const guidesCount = await guidesCollection.countDocuments();
    if (guidesCount === 0 && INITIAL_BUYING_GUIDES.length > 0) {
      console.log(`[MongoDB] Seeding ${INITIAL_BUYING_GUIDES.length} buying guides into MongoDB...`);
      await guidesCollection.insertMany(INITIAL_BUYING_GUIDES);
    }

    // Seed Default Users into MongoDB if empty
    const usersCount = await usersCollection.countDocuments();
    if (usersCount === 0) {
      console.log(`[MongoDB] Seeding default platform user accounts into MongoDB...`);
      await usersCollection.insertMany(DEFAULT_ACCOUNTS);
    }

    // Seed Inquiries into MongoDB if empty
    const inqCount = await inquiriesCollection.countDocuments();
    if (inqCount === 0) {
      console.log(`[MongoDB] Seeding default advisor inquiries into MongoDB...`);
      await inquiriesCollection.insertMany(DEFAULT_INQUIRIES);
    }

    // Sync memory cache from MongoDB
    memoryProducts = await productsCollection.find({}).toArray();
    memoryGuides = await guidesCollection.find({}).toArray();
    memoryUsers = await usersCollection.find({}).toArray();
    memoryInquiries = await inquiriesCollection.find({}).toArray();

    // Persist snapshot to disk for offline resilience
    fs.writeFileSync(backupProductsPath, JSON.stringify(memoryProducts, null, 2));
    fs.writeFileSync(backupGuidesPath, JSON.stringify(memoryGuides, null, 2));
    fs.writeFileSync(backupUsersPath, JSON.stringify(memoryUsers, null, 2));
    fs.writeFileSync(backupInquiriesPath, JSON.stringify(memoryInquiries, null, 2));

    console.log(`[MongoDB] Active collections verified: ${memoryProducts.length} products, ${memoryGuides.length} guides, ${memoryUsers.length} users, ${memoryInquiries.length} inquiries ready in MongoDB.`);
    return true;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB server (${err.message}).`);
    console.log(`[MongoDB] Operating with local JSON storage engine (${memoryProducts.length} products, ${memoryUsers.length} users).`);
    console.log(`[MongoDB] Tip: Set MONGODB_URI in your .env (or run MongoDB on localhost:27017) to link your live database.`);
    return false;
  }
}

/**
 * Get MongoDB Status
 */
export async function getMongoStatus() {
  let stats = {
    database: DB_NAME,
    type: "MongoDB (Official Node.js driver)",
    connected: isConnected,
    uri: DEFAULT_MONGODB_URI.replace(/:([^:@]{4,})@/, ":****@"),
    error: connectionError,
    productsCount: memoryProducts.length,
    guidesCount: memoryGuides.length,
    usersCount: memoryUsers.length,
    inquiriesCount: memoryInquiries.length,
    wiselistsCount: Object.keys(memoryWiseLists).length
  };

  if (isConnected && database) {
    try {
      stats.productsCount = await database.collection("products").countDocuments();
      stats.guidesCount = await database.collection("guides").countDocuments();
      stats.usersCount = await database.collection("users").countDocuments();
      stats.inquiriesCount = await database.collection("inquiries").countDocuments();
      stats.wiselistsCount = await database.collection("wiselists").countDocuments();
    } catch (e) {
      // Ignore count error
    }
  }

  return stats;
}

/**
 * PRODUCTS CRUD
 */
export async function getAllProducts() {
  if (isConnected && database) {
    try {
      const items = await database.collection("products").find({}).toArray();
      return items.map(({ _id, ...rest }) => rest);
    } catch (err) {
      console.error("[MongoDB] Error in getAllProducts, falling back to storage:", err.message);
    }
  }
  return memoryProducts;
}

export async function addProduct(productData) {
  const newProduct = {
    ...productData,
    id: productData.id || `product-${Date.now()}`,
    rating: parseFloat(productData.rating) || 4.5,
    price: parseInt(productData.price, 10) || 0,
    aiScore: parseInt(productData.aiScore, 10) || 85,
    createdAt: new Date().toISOString()
  };

  if (isConnected && database) {
    try {
      await database.collection("products").insertOne({ ...newProduct });
    } catch (err) {
      console.error("[MongoDB] Error inserting product:", err.message);
    }
  }

  memoryProducts.unshift(newProduct);
  try {
    fs.writeFileSync(backupProductsPath, JSON.stringify(memoryProducts, null, 2));
  } catch (e) {}

  return newProduct;
}

export async function updateProduct(id, updateData) {
  let updatedItem = null;

  if (isConnected && database) {
    try {
      const result = await database.collection("products").findOneAndUpdate(
        { id },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } },
        { returnDocument: "after" }
      );
      if (result) {
        const { _id, ...rest } = result;
        updatedItem = rest;
      }
    } catch (err) {
      console.error("[MongoDB] Error updating product:", err.message);
    }
  }

  const idx = memoryProducts.findIndex(p => p.id === id);
  if (idx !== -1) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...updateData, id };
    updatedItem = memoryProducts[idx];
    try {
      fs.writeFileSync(backupProductsPath, JSON.stringify(memoryProducts, null, 2));
    } catch (e) {}
  }

  return updatedItem;
}

export async function deleteProduct(id) {
  let success = false;

  if (isConnected && database) {
    try {
      const res = await database.collection("products").deleteOne({ id });
      success = res.deletedCount > 0;
    } catch (err) {
      console.error("[MongoDB] Error deleting product:", err.message);
    }
  }

  const initialLen = memoryProducts.length;
  memoryProducts = memoryProducts.filter(p => p.id !== id);
  if (memoryProducts.length !== initialLen) {
    success = true;
    try {
      fs.writeFileSync(backupProductsPath, JSON.stringify(memoryProducts, null, 2));
    } catch (e) {}
  }

  return success;
}

/**
 * GUIDES CRUD
 */
export async function getAllGuides() {
  if (isConnected && database) {
    try {
      const items = await database.collection("guides").find({}).toArray();
      return items.map(({ _id, ...rest }) => rest);
    } catch (err) {
      console.error("[MongoDB] Error in getAllGuides:", err.message);
    }
  }
  return memoryGuides;
}

export async function addGuide(guideData) {
  const newGuide = {
    ...guideData,
    id: guideData.id || `guide-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (isConnected && database) {
    try {
      await database.collection("guides").insertOne({ ...newGuide });
    } catch (err) {
      console.error("[MongoDB] Error inserting guide:", err.message);
    }
  }

  memoryGuides.unshift(newGuide);
  try {
    fs.writeFileSync(backupGuidesPath, JSON.stringify(memoryGuides, null, 2));
  } catch (e) {}

  return newGuide;
}

/**
 * INQUIRIES CRUD
 */
export async function saveInquiry(inquiryData) {
  const inquiry = {
    ...inquiryData,
    id: inquiryData.id || `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: inquiryData.status || "pending"
  };

  if (isConnected && database) {
    try {
      await database.collection("inquiries").insertOne({ ...inquiry });
    } catch (err) {
      console.error("[MongoDB] Error saving inquiry:", err.message);
    }
  }

  memoryInquiries.unshift(inquiry);
  try {
    fs.writeFileSync(backupInquiriesPath, JSON.stringify(memoryInquiries, null, 2));
  } catch (e) {}

  return inquiry;
}

export async function getInquiries() {
  if (isConnected && database) {
    try {
      const items = await database.collection("inquiries").find({}).sort({ createdAt: -1 }).toArray();
      return items.map(({ _id, ...rest }) => rest);
    } catch (err) {
      console.error("[MongoDB] Error reading inquiries:", err.message);
    }
  }
  return memoryInquiries;
}

export async function updateInquiryReply(id, replyText, status = "replied") {
  let updatedInquiry = null;

  if (isConnected && database) {
    try {
      const res = await database.collection("inquiries").findOneAndUpdate(
        { id },
        { $set: { reply: replyText, status: status, repliedAt: new Date().toISOString() } },
        { returnDocument: "after" }
      );
      if (res) {
        const { _id, ...rest } = res;
        updatedInquiry = rest;
      }
    } catch (err) {
      console.error("[MongoDB] Error updating inquiry reply:", err.message);
    }
  }

  const idx = memoryInquiries.findIndex(i => i.id === id);
  if (idx !== -1) {
    memoryInquiries[idx] = {
      ...memoryInquiries[idx],
      reply: replyText,
      status: status,
      repliedAt: new Date().toISOString()
    };
    updatedInquiry = memoryInquiries[idx];
    try {
      fs.writeFileSync(backupInquiriesPath, JSON.stringify(memoryInquiries, null, 2));
    } catch (e) {}
  }

  return updatedInquiry;
}

/**
 * USERS CRUD & Authentication
 */
export async function getAllUsers() {
  if (isConnected && database) {
    try {
      const users = await database.collection("users").find({}).toArray();
      return users.map(({ _id, ...rest }) => rest);
    } catch (err) {
      console.error("[MongoDB] Error getting all users:", err.message);
    }
  }
  return memoryUsers;
}

export async function upsertUser(userData) {
  if (!userData || !userData.email) return null;
  const normalizedEmail = userData.email.toLowerCase().trim();
  const user = {
    ...userData,
    email: normalizedEmail,
    updatedAt: new Date().toISOString()
  };

  if (isConnected && database) {
    try {
      await database.collection("users").updateOne(
        { email: normalizedEmail },
        { $set: user },
        { upsert: true }
      );
    } catch (err) {
      console.error("[MongoDB] Error upserting user:", err.message);
    }
  }

  const idx = memoryUsers.findIndex(u => u.email?.toLowerCase() === normalizedEmail);
  if (idx !== -1) {
    memoryUsers[idx] = { ...memoryUsers[idx], ...user };
  } else {
    memoryUsers.push({
      ...user,
      createdAt: user.createdAt || new Date().toISOString()
    });
  }

  try {
    fs.writeFileSync(backupUsersPath, JSON.stringify(memoryUsers, null, 2));
  } catch (e) {}

  return user;
}

export async function getUserByEmail(email) {
  if (!email) return null;
  const normalized = email.toLowerCase().trim();
  if (isConnected && database) {
    try {
      const found = await database.collection("users").findOne({ email: normalized });
      if (found) {
        const { _id, ...rest } = found;
        return rest;
      }
    } catch (err) {
      console.error("[MongoDB] Error finding user:", err.message);
    }
  }
  return memoryUsers.find(u => u.email?.toLowerCase() === normalized) || null;
}

export async function deleteUserByEmail(email) {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  let success = false;

  if (isConnected && database) {
    try {
      const res = await database.collection("users").deleteOne({ email: normalized });
      success = res.deletedCount > 0;
    } catch (err) {
      console.error("[MongoDB] Error deleting user:", err.message);
    }
  }

  const initialLen = memoryUsers.length;
  memoryUsers = memoryUsers.filter(u => u.email?.toLowerCase() !== normalized);
  if (memoryUsers.length !== initialLen) {
    success = true;
    try {
      fs.writeFileSync(backupUsersPath, JSON.stringify(memoryUsers, null, 2));
    } catch (e) {}
  }

  return success;
}

export async function verifyUserLogin(email, password) {
  if (!email || !password) return { success: false, error: "Email and password are required" };
  const user = await getUserByEmail(email);
  if (!user) {
    return { success: false, error: "No account found registered with this email address." };
  }
  if (user.password && user.password !== password) {
    return { success: false, error: "Incorrect password. Please verify your credentials." };
  }
  const { password: pw, _id, ...safeUser } = user;
  return { success: true, user: safeUser };
}

export async function updateUserPassword(email, newPassword) {
  if (!email || !newPassword) return false;
  const normalized = email.toLowerCase().trim();

  if (isConnected && database) {
    try {
      await database.collection("users").updateOne(
        { email: normalized },
        { $set: { password: newPassword, updatedAt: new Date().toISOString() } }
      );
    } catch (err) {
      console.error("[MongoDB] Error updating user password:", err.message);
    }
  }

  const idx = memoryUsers.findIndex(u => u.email?.toLowerCase() === normalized);
  if (idx !== -1) {
    memoryUsers[idx].password = newPassword;
    memoryUsers[idx].updatedAt = new Date().toISOString();
  } else {
    memoryUsers.push({
      name: email.split('@')[0],
      email: normalized,
      password: newPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  try {
    fs.writeFileSync(backupUsersPath, JSON.stringify(memoryUsers, null, 2));
  } catch (e) {}
  return true;
}

/**
 * WISELISTS CRUD
 */
export async function getUserWiseLists(email) {
  if (!email) return [];
  const normalized = email.toLowerCase().trim();

  if (isConnected && database) {
    try {
      const found = await database.collection("wiselists").findOne({ email: normalized });
      if (found && Array.isArray(found.wiselists)) {
        return found.wiselists;
      }
    } catch (err) {
      console.error("[MongoDB] Error fetching wiselists:", err.message);
    }
  }

  return memoryWiseLists[normalized] || [
    { id: 'default', name: 'My Tech WiseList', description: 'Primary tracking list', productIds: [] }
  ];
}

export async function saveUserWiseLists(email, wiselists) {
  if (!email || !Array.isArray(wiselists)) return null;
  const normalized = email.toLowerCase().trim();

  if (isConnected && database) {
    try {
      await database.collection("wiselists").updateOne(
        { email: normalized },
        { $set: { email: normalized, wiselists, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (err) {
      console.error("[MongoDB] Error saving wiselists:", err.message);
    }
  }

  memoryWiseLists[normalized] = wiselists;
  try {
    fs.writeFileSync(backupWiseListsPath, JSON.stringify(memoryWiseLists, null, 2));
  } catch (e) {}

  return wiselists;
}
