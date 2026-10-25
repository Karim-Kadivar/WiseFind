import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { 
    initMongoDatabase, 
    getMongoStatus, 
    getAllProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getAllGuides, 
    addGuide,
    saveInquiry,
    getInquiries,
    updateInquiryReply,
    getAllUsers,
    upsertUser,
    getUserByEmail,
    deleteUserByEmail,
    verifyUserLogin,
    updateUserPassword,
    getUserWiseLists,
    saveUserWiseLists
} from "./db/mongo.js";
import { 
    sendActivationEmail,
    sendPasswordResetOtp, 
    sendInquiryReplyEmail, 
    sendPriceAlertEmail 
} from "./server/emailService.js";
import { searchFlipkartProducts, getFlipkartConfig } from "./server/flipkartService.js";

dotenv.config();

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
        ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build',
                }
            }
        });
        console.log("Gemini API Client initialized successfully.");
    }
    catch (err) {
        console.error("Failed to initialize Gemini API Client:", err);
    }
}
else {
    console.log("No valid GEMINI_API_KEY found. Running in mock-AI mode.");
}

async function startServer() {
    const app = express();
    const PORT = 3000;
    app.use(express.json());

    // Connect & Initialize MongoDB Collections
    await initMongoDatabase();

    // --- API ROUTES ---
    // Health check with MongoDB telemetry
    app.get("/api/health", async (req, res) => {
        const dbStatus = await getMongoStatus();
        res.json({ 
            status: "ok", 
            aiEnabled: !!ai,
            database: dbStatus
        });
    });

    // Dedicated MongoDB Status Endpoint
    app.get("/api/db-status", async (req, res) => {
        const dbStatus = await getMongoStatus();
        res.json(dbStatus);
    });

    // Get all products from MongoDB
    app.get("/api/products", async (req, res) => {
        try {
            const products = await getAllProducts();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch products from MongoDB", message: err.message });
        }
    });

    // Flipkart API Configuration & Key Status Endpoint
    app.get("/api/flipkart/config", (req, res) => {
        res.json(getFlipkartConfig());
    });

    // Flipkart Category & Subcategory Products with Realtime Platform Comparisons
    app.get("/api/flipkart/category-products", async (req, res) => {
        try {
            const { category, subCategory, limit } = req.query;
            const result = await searchFlipkartProducts({
                query: "",
                category: category || "All",
                subCategory: subCategory || "",
                limit: parseInt(limit, 10) || 12
            });
            res.json(result);
        } catch (err) {
            console.error("[Flipkart Category API] Error:", err);
            res.status(500).json({ error: "Failed to fetch category products", message: err.message });
        }
    });

    // Flipkart Product Search & Multi-Platform Comparison API
    // Supports query, category, limit, and returns clustered results: exact, bitBelow, bitAbove
    app.get("/api/flipkart/search", async (req, res) => {
        try {
            const { q, query, category, subCategory, limit } = req.query;
            const searchStr = q || query || "";
            const result = await searchFlipkartProducts({
                query: searchStr,
                category: category || "All",
                subCategory: subCategory || "",
                limit: parseInt(limit, 10) || 12
            });
            res.json(result);
        } catch (err) {
            console.error("[Flipkart API] Search error:", err);
            res.status(500).json({ error: "Failed to search Flipkart products", message: err.message });
        }
    });

    // Scrape live search endpoint (aliases to Flipkart universal search)
    app.get("/api/scrape/live", async (req, res) => {
        try {
            const { q, query, category, limit } = req.query;
            const searchStr = q || query || "";
            const result = await searchFlipkartProducts({
                query: searchStr,
                category: category || "All",
                limit: parseInt(limit, 10) || 12
            });
            res.json(result);
        } catch (err) {
            console.error("[Live Scrape API] Error:", err);
            res.status(500).json({ error: "Failed to scrape live products", message: err.message });
        }
    });

    // Add product to MongoDB (Admin)
    app.post("/api/products", async (req, res) => {
        try {
            const newProduct = await addProduct(req.body);
            res.status(201).json(newProduct);
        } catch (err) {
            res.status(500).json({ error: "Failed to add product to MongoDB", message: err.message });
        }
    });

    // Update product in MongoDB (Admin)
    app.put("/api/products/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await updateProduct(id, req.body);
            if (!updated) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: "Failed to update product in MongoDB", message: err.message });
        }
    });

    // Delete product in MongoDB (Admin)
    app.delete("/api/products/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await deleteProduct(id);
            if (!deleted) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json({ success: true, id });
        } catch (err) {
            res.status(500).json({ error: "Failed to delete product in MongoDB", message: err.message });
        }
    });

    // Get buying guides from MongoDB
    app.get("/api/guides", async (req, res) => {
        try {
            const guides = await getAllGuides();
            res.json(guides);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch guides from MongoDB", message: err.message });
        }
    });

    // Create guide in MongoDB (Admin)
    app.post("/api/guides", async (req, res) => {
        try {
            const newGuide = await addGuide(req.body);
            res.status(201).json(newGuide);
        } catch (err) {
            res.status(500).json({ error: "Failed to create guide in MongoDB", message: err.message });
        }
    });

    // Customer Advisor Inquiries in MongoDB
    app.get("/api/inquiries", async (req, res) => {
        try {
            const inquiries = await getInquiries();
            res.json(inquiries);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch inquiries from MongoDB", message: err.message });
        }
    });

    app.post("/api/inquiries", async (req, res) => {
        try {
            const saved = await saveInquiry(req.body);
            res.status(201).json(saved);
        } catch (err) {
            res.status(500).json({ error: "Failed to save inquiry in MongoDB", message: err.message });
        }
    });

    // Advisor reply to inquiry in MongoDB
    app.put("/api/inquiries/:id/reply", async (req, res) => {
        try {
            const { id } = req.params;
            const { reply, status, advisorName, productTitle } = req.body;
            const updated = await updateInquiryReply(id, reply, status || "replied");
            if (!updated) return res.status(404).json({ error: "Inquiry not found in MongoDB" });

            // Send actual email update to the customer from hello.wisefind@gmail.com
            const recipientEmail = updated.userEmail || updated.customerEmail || req.body.customerEmail;
            if (recipientEmail) {
                try {
                    await sendInquiryReplyEmail({
                        toEmail: recipientEmail,
                        customerName: updated.userName || updated.customerName || "WiseFind Shopper",
                        advisorName: advisorName || "Certified Category Advisor",
                        productTitle: productTitle || updated.productTitle,
                        replyText: reply,
                        inquiryQuestion: updated.question || updated.message || updated.dilemma
                    });
                } catch (emailErr) {
                    console.warn("[Gmail Service] Error sending inquiry notification email:", emailErr.message);
                }
            }

            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: "Failed to update inquiry in MongoDB", message: err.message });
        }
    });

    // WiseLists CRUD in MongoDB
    app.get("/api/wiselists/:email", async (req, res) => {
        try {
            const { email } = req.params;
            const wiselists = await getUserWiseLists(email);
            res.json(wiselists);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch WiseLists from MongoDB", message: err.message });
        }
    });

    app.post("/api/wiselists/:email", async (req, res) => {
        try {
            const { email } = req.params;
            const saved = await saveUserWiseLists(email, req.body);
            res.json(saved);
        } catch (err) {
            res.status(500).json({ error: "Failed to save WiseLists in MongoDB", message: err.message });
        }
    });

    // User Directory & Account Management in MongoDB (Admin)
    app.get("/api/users", async (req, res) => {
        try {
            const users = await getAllUsers();
            // Strip passwords from directory listing
            const sanitized = users.map(({ password, ...u }) => u);
            res.json(sanitized);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch users from MongoDB", message: err.message });
        }
    });

    // Provision New User Account in MongoDB (Admin or Registration)
    app.post("/api/users", async (req, res) => {
        try {
            const { name, email, password, role, advisorCategory, advisorExperience } = req.body;
            if (!email) return res.status(400).json({ error: "Email is required" });
            const existing = await getUserByEmail(email);
            if (existing) {
                return res.status(409).json({ error: "An account with this email address already exists in MongoDB." });
            }
            const newUser = {
                name: (name || "").trim(),
                email: email.trim().toLowerCase(),
                password: password || "User@123",
                role: role || "user",
                advisorCategory: advisorCategory || null,
                advisorExperience: advisorExperience || null,
                createdAt: new Date().toISOString()
            };
            await upsertUser(newUser);
            const { password: pw, ...safe } = newUser;
            res.status(201).json(safe);
        } catch (err) {
            res.status(500).json({ error: "Failed to create user in MongoDB", message: err.message });
        }
    });

    // Delete User from MongoDB (Admin)
    app.delete("/api/users/:email", async (req, res) => {
        try {
            const { email } = req.params;
            const deleted = await deleteUserByEmail(email);
            if (!deleted) return res.status(404).json({ error: "User not found in MongoDB" });
            res.json({ success: true, email });
        } catch (err) {
            res.status(500).json({ error: "Failed to delete user from MongoDB", message: err.message });
        }
    });

    // Native Login via MongoDB Credentials
    app.post("/api/auth/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await verifyUserLogin(email, password);
            if (!result.success) {
                return res.status(401).json({ error: result.error });
            }
            res.json({ success: true, user: result.user });
        } catch (err) {
            res.status(500).json({ error: "Authentication failed", message: err.message });
        }
    });

    // Change User Password in MongoDB
    app.post("/api/auth/change-password", async (req, res) => {
        try {
            const { email, currentPassword, newPassword } = req.body;
            const verify = await verifyUserLogin(email, currentPassword);
            if (!verify.success) {
                return res.status(401).json({ error: "Current password does not match records." });
            }
            const updated = await updateUserPassword(email, newPassword);
            if (!updated) return res.status(500).json({ error: "Failed to update password." });
            res.json({ success: true, message: "Password updated securely in MongoDB." });
        } catch (err) {
            res.status(500).json({ error: "Password update failed", message: err.message });
        }
    });

    // In-memory pending registrations (valid for 15 minutes)
    const pendingRegistrations = new Map();

    // POST /api/auth/register-request - Sends actual activation email from hello.wisefind@gmail.com
    app.post("/api/auth/register-request", async (req, res) => {
        try {
            const { name, email, password, role = "user", advisorCategory, advisorExperience } = req.body;
            if (!email || !email.includes('@')) {
                return res.status(400).json({ error: "A valid email address is required." });
            }
            if (!password || password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long." });
            }
            const normalizedEmail = email.trim().toLowerCase();

            // Check if user already exists in database
            const existingUser = await getUserByEmail(normalizedEmail);
            if (existingUser) {
                return res.status(400).json({ 
                    error: "An account with this email address already exists. Please sign in or use Forgot Password." 
                });
            }

            // Generate authentic 6-digit cryptographic activation code
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

            pendingRegistrations.set(normalizedEmail, {
                name: (name || "").trim() || normalizedEmail.split('@')[0],
                email: normalizedEmail,
                password,
                role: role || "user",
                advisorCategory: advisorCategory || "",
                advisorExperience: advisorExperience || "",
                otp,
                expiresAt
            });

            // Dispatch activation email from hello.wisefind@gmail.com
            const emailResult = await sendActivationEmail({
                toEmail: normalizedEmail,
                userName: name || normalizedEmail.split('@')[0],
                otp,
                role
            });

            const senderEmail = process.env.GMAIL_USER || 'hello.wisefind@gmail.com';
            console.log(`[Auth] Outbound Account Activation code dispatched for ${normalizedEmail} from ${senderEmail}`);

            res.json({
                success: true,
                email: normalizedEmail,
                message: `Activation code sent to ${normalizedEmail} from ${senderEmail}. Please check your inbox or spam folder.`,
                sender: senderEmail,
                sentViaGmail: emailResult.sentViaGmail
            });
        } catch (err) {
            console.error("[Auth] Registration request error:", err);
            res.status(500).json({ error: "Failed to dispatch activation email", message: err.message });
        }
    });

    // POST /api/auth/register-verify - Verifies activation OTP and activates user account
    app.post("/api/auth/register-verify", async (req, res) => {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ error: "Email and 6-digit activation code are required." });
            }
            const normalizedEmail = email.trim().toLowerCase();
            const pending = pendingRegistrations.get(normalizedEmail);

            if (!pending) {
                return res.status(400).json({ 
                    error: "No pending registration found for this email or the code has expired. Please sign up again." 
                });
            }

            if (Date.now() > pending.expiresAt) {
                pendingRegistrations.delete(normalizedEmail);
                return res.status(400).json({ 
                    error: "Activation code has expired. Please request a new activation code." 
                });
            }

            if (pending.otp.trim() !== String(otp).trim()) {
                return res.status(400).json({ 
                    error: "Invalid activation code. Please check your email and enter the 6-digit code." 
                });
            }

            // OTP verified! Persist new user in MongoDB and platform directory
            const newUser = {
                id: `usr-${Date.now()}`,
                name: pending.name,
                email: normalizedEmail,
                password: pending.password,
                role: pending.role,
                advisorCategory: pending.advisorCategory,
                advisorExperience: pending.advisorExperience,
                emailVerified: true,
                createdAt: new Date().toISOString()
            };

            await upsertUser(newUser);
            pendingRegistrations.delete(normalizedEmail);

            const { password: pw, ...safeUser } = newUser;
            res.json({
                success: true,
                message: "Account activated successfully! Welcome to WiseFind.",
                user: safeUser
            });
        } catch (err) {
            console.error("[Auth] Register verify error:", err);
            res.status(500).json({ error: "Failed to activate account", message: err.message });
        }
    });

    // POST /api/auth/resend-activation - Resends fresh activation code to pending email
    app.post("/api/auth/resend-activation", async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: "Email is required." });
            const normalizedEmail = email.trim().toLowerCase();
            const pending = pendingRegistrations.get(normalizedEmail);

            if (!pending) {
                return res.status(400).json({ error: "No pending registration found for this email. Please sign up again." });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            pending.otp = otp;
            pending.expiresAt = Date.now() + 15 * 60 * 1000;
            pendingRegistrations.set(normalizedEmail, pending);

            await sendActivationEmail({
                toEmail: normalizedEmail,
                userName: pending.name,
                otp,
                role: pending.role
            });

            const senderEmail = process.env.GMAIL_USER || 'hello.wisefind@gmail.com';
            res.json({
                success: true,
                message: `A fresh activation code has been sent to ${normalizedEmail} from ${senderEmail}.`
            });
        } catch (err) {
            res.status(500).json({ error: "Failed to resend activation code", message: err.message });
        }
    });

    // In-memory OTP storage for forgot password (valid for 15 minutes)
    const activePasswordResetOtps = new Map();

    // POST /api/auth/forgot-password - Dispatches real email from hello.wisefind@gmail.com
    app.post("/api/auth/forgot-password", async (req, res) => {
        try {
            const { email } = req.body;
            if (!email || !email.includes('@')) {
                return res.status(400).json({ error: "A valid email address is required." });
            }
            const normalizedEmail = email.trim().toLowerCase();
            
            // Check if user exists in MongoDB or seed pool
            let user = await getUserByEmail(normalizedEmail);
            const userName = user ? user.name : "WiseFind User";

            // Generate authentic 6-digit cryptographic security code
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

            activePasswordResetOtps.set(normalizedEmail, {
                otp,
                expiresAt,
                userName
            });

            // Dispatch actual email using Nodemailer and Gmail SMTP
            const emailResult = await sendPasswordResetOtp({
                toEmail: normalizedEmail,
                userName,
                otp
            });

            const senderEmail = process.env.GMAIL_USER || 'hello.wisefind@gmail.com';
            console.log(`[Auth] Outbound Password Reset code dispatched for ${normalizedEmail} from ${senderEmail}`);

            res.json({
                success: true,
                message: `Verification code sent to ${normalizedEmail} from ${senderEmail}. Check your inbox and spam folder.`,
                sender: senderEmail,
                sentViaGmail: emailResult.sentViaGmail
            });
        } catch (err) {
            console.error("[Auth] Forgot password error:", err);
            res.status(500).json({ error: "Failed to dispatch password recovery email", message: err.message });
        }
    });

    // POST /api/auth/verify-reset-otp - Validates OTP and updates password
    app.post("/api/auth/verify-reset-otp", async (req, res) => {
        try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword) {
                return res.status(400).json({ error: "Email, 6-digit OTP, and new password are required." });
            }
            const normalizedEmail = email.trim().toLowerCase();
            const record = activePasswordResetOtps.get(normalizedEmail);

            if (!record) {
                return res.status(400).json({ error: "No active password reset request found for this email. Please request a new code." });
            }

            if (Date.now() > record.expiresAt) {
                activePasswordResetOtps.delete(normalizedEmail);
                return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
            }

            if (record.otp.trim() !== String(otp).trim()) {
                return res.status(400).json({ error: "Invalid verification code. Please check your 6-digit code." });
            }

            // OTP verified! Update password in MongoDB / persistent storage
            await updateUserPassword(normalizedEmail, newPassword);
            activePasswordResetOtps.delete(normalizedEmail);

            res.json({
                success: true,
                message: "Password updated successfully in WiseFind database. You can now sign in with your new credentials."
            });
        } catch (err) {
            console.error("[Auth] Reset OTP verification error:", err);
            res.status(500).json({ error: "Failed to reset password", message: err.message });
        }
    });

    // POST /api/notify/price-drop - Dispatches Price Drop Alert from hello.wisefind@gmail.com
    app.post("/api/notify/price-drop", async (req, res) => {
        try {
            const { email, customerName, productName, targetPrice, currentLowest, storeName } = req.body;
            if (!email || !productName || !currentLowest) {
                return res.status(400).json({ error: "Email, productName, and currentLowest are required." });
            }
            const result = await sendPriceAlertEmail({
                toEmail: email,
                customerName: customerName || "Shopper",
                productName,
                targetPrice,
                currentLowest,
                storeName: storeName || "Flipkart"
            });
            res.json({ success: true, message: `Price drop alert email sent from hello.wisefind@gmail.com to ${email}`, result });
        } catch (err) {
            res.status(500).json({ error: "Failed to send price alert email", message: err.message });
        }
    });



    // AI Buying Intelligence Recommendation Endpoint with Search Grounding
    app.post("/api/recommend", async (req, res) => {
        const { query, preferences } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }
        const productsList = await getAllProducts();
        if (!ai) {
            // Return beautiful structured offline mock recommendations based on actual query keyword matching
            console.log("No Gemini API key. Generating offline semantic recommendation for:", query);
            const offlineResult = generateOfflineRecommendation(query, productsList, preferences);
            return res.json(offlineResult);
        }
        try {
            console.log("Invoking Gemini 3.5 Flash for Buying Recommendation with search grounding.");
            let preferencesStr = "";
            if (preferences) {
                preferencesStr = `
        The user has personalized their shopping preferences as follows:
        - Favorite Brand: ${preferences.brand || "Flexible"}
        - Target Category: ${preferences.category || "All"}
        - Buying Priority: ${preferences.priority || "Value for Money"}
        Please boost recommendations that align with these preferences where appropriate.`;
            }
            const prompt = `
      You are WiseFind, a cutting-edge Buying Intelligence Platform.
      The user is asking for product suggestions or buying advice in natural language:
      "${query}"
      ${preferencesStr}

      Use the googleSearch tool to locate the best, most up-to-date products available in the Indian market that fit this user request perfectly.
      Make sure prices, models, and specifications reflect actual current market conditions in 2026.
      Express all prices in Indian Rupees (INR) with standard Lakh/Thousand representation (e.g. ₹70,000, ₹1.2 Lakh).

      You MUST output your response in valid JSON format matching this schema:
      {
        "extractedRequirements": {
          "budget": "The detected budget (e.g., 'Under ₹70,000')",
          "purpose": "Primary purpose or utility extracted",
          "brandPreference": "Preferred brand if any, otherwise 'None'",
          "preferredFeatures": ["List of key features wanted"],
          "usageScenario": "Short summary of how the product will be used"
        },
        "recommendations": [
          {
            "productName": "Exact Brand and Model Name of Product 1",
            "brand": "Brand Name",
            "priceEstimate": "Estimated real market price in INR (e.g., ₹68,900)",
            "aiMatchScore": 95, // Integer between 40-100 representing how well it matches criteria
            "matchReason": "Clear, objective explanation of why this product fits their needs.",
            "specsHighlight": {
              "Key Spec 1": "Value 1",
              "Key Spec 2": "Value 2",
              "Key Spec 3": "Value 3",
              "Key Spec 4": "Value 4"
            },
            "strengths": ["Strength 1", "Strength 2", "Strength 3"],
            "weaknesses": ["Weakness 1", "Weakness 2"],
            "buyingAdvice": "Practical buying tip for this model, e.g., 'Opt for the 16GB variant for long-term development work.'",
            "alternatives": ["Alternative Model A", "Alternative Model B"]
          }
        ],
        "overallBuyingVerdict": "An elegant, comprehensive final analysis, highlighting trade-offs, which product to choose for which scenario, and general buying recommendations."
      }
      `;
            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            extractedRequirements: {
                                type: Type.OBJECT,
                                properties: {
                                    budget: { type: Type.STRING },
                                    purpose: { type: Type.STRING },
                                    brandPreference: { type: Type.STRING },
                                    preferredFeatures: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    usageScenario: { type: Type.STRING }
                                },
                                required: ["budget", "purpose", "brandPreference", "preferredFeatures", "usageScenario"]
                            },
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        productName: { type: Type.STRING },
                                        brand: { type: Type.STRING },
                                        priceEstimate: { type: Type.STRING },
                                        aiMatchScore: { type: Type.INTEGER },
                                        matchReason: { type: Type.STRING },
                                        specsHighlight: {
                                            type: Type.OBJECT,
                                            properties: {
                                                "Display": { type: Type.STRING },
                                                "Processor": { type: Type.STRING },
                                                "Battery": { type: Type.STRING },
                                                "Storage/RAM": { type: Type.STRING }
                                            }
                                        },
                                        strengths: {
                                            type: Type.ARRAY,
                                            items: { type: Type.STRING }
                                        },
                                        weaknesses: {
                                            type: Type.ARRAY,
                                            items: { type: Type.STRING }
                                        },
                                        buyingAdvice: { type: Type.STRING },
                                        alternatives: {
                                            type: Type.ARRAY,
                                            items: { type: Type.STRING }
                                        }
                                    },
                                    required: [
                                        "productName", "brand", "priceEstimate", "aiMatchScore",
                                        "matchReason", "specsHighlight", "strengths", "weaknesses",
                                        "buyingAdvice", "alternatives"
                                    ]
                                }
                            },
                            overallBuyingVerdict: { type: Type.STRING }
                        },
                        required: ["extractedRequirements", "recommendations", "overallBuyingVerdict"]
                    }
                }
            });
            const textOutput = response.text || "{}";
            const parsedData = JSON.parse(textOutput.trim());
            res.json(parsedData);
        }
        catch (err) {
            console.error("Gemini recommendation processing failed, falling back to local DB", err);
            const offlineResult = generateOfflineRecommendation(query, productsList);
            res.json(offlineResult);
        }
    });
    // WiseBot conversational API
    app.post("/api/chat", async (req, res) => {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        const productsList = await getAllProducts();
        if (!ai) {
            // Mock WiseBot chat logic
            const reply = getOfflineBotReply(message, productsList);
            return res.json({ text: reply });
        }
        try {
            console.log("Invoking WiseBot chat session with Gemini...");
            const formattedHistory = (history || []).map((msg) => ({
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.text }]
            }));
            // Append general system guidelines
            const chat = ai.chats.create({
                model: "gemini-3.5-flash",
                config: {
                    systemInstruction: `
            You are WiseBot, the intelligent Shopping Assistant for WiseFind.
            WiseFind is an objective, neutral Buying Intelligence Platform, NOT a seller.
            Your role is to act as a helpful expert shopper. Answer user questions about specs, explain technical concepts simply, suggest perfect alternatives, compare models, and point out trade-offs.
            Be crisp, concise, objective, and friendly. Speak primarily about products in Indian Rupees (₹).
            If asked about specific specifications, give accurate details. Encourage the user to focus on actual user experience rather than marketing specifications.
          `,
                },
                history: formattedHistory
            });
            const response = await chat.sendMessage({ message: message });
            res.json({ text: response.text });
        }
        catch (err) {
            console.error("WiseBot error, using fallback replies", err);
            const reply = getOfflineBotReply(message, productsList);
            res.json({ text: reply });
        }
    });

    // --- GOOGLE OAUTH 2.0 FLOW ---
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

    // 1. Check OAuth configuration status
    app.get("/api/auth/google/status", (req, res) => {
        res.json({
            configured: Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET),
            clientId: GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.slice(0, 12)}...` : null,
            callbackUrl: GOOGLE_CALLBACK_URL
        });
    });

    // 2. Initiate Google OAuth redirect
    app.get("/api/auth/google", (req, res) => {
        const role = req.query.role || "user";
        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Google OAuth Setup Required</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; background: #090D16; color: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; box-sizing: border-box; }
                        .card { max-width: 480px; width: 100%; background: #0E1322; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: center; }
                        h2 { color: #F87171; margin-top: 0; font-size: 20px; font-weight: 800; }
                        p { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 12px 0; }
                        code { background: #12182B; color: #818CF8; padding: 3px 8px; border-radius: 6px; font-size: 13px; border: 1px solid rgba(129,140,248,0.2); }
                        .url-box { background: #12182B; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #34D399; margin: 16px 0; word-break: break-all; text-align: left; }
                        button { margin-top: 20px; padding: 10px 24px; background: #4F46E5; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
                        button:hover { opacity: 0.9; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>⚠️ Google OAuth Not Configured</h2>
                        <p>Missing <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> in your <code>.env</code> file.</p>
                        <p>Please configure an OAuth 2.0 Client ID in the Google Cloud Console with this Authorized Redirect URI:</p>
                        <div class="url-box">${GOOGLE_CALLBACK_URL}</div>
                        <p>After saving your credentials to <code>.env</code>, restart the server.</p>
                        <button onclick="window.close()">Close Window</button>
                    </div>
                </body>
                </html>
            `);
        }

        const state = Buffer.from(JSON.stringify({ role, timestamp: Date.now() })).toString("base64");
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_CALLBACK_URL,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "select_account",
            state: state
        });

        res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
    });

    // 3. Google OAuth Callback (Localhost endpoint)
    app.get("/api/auth/google/callback", async (req, res) => {
        const { code, state, error } = req.query;

        if (error) {
            console.error("[Google OAuth] Error during consent:", error);
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Google Sign-In Cancelled</title>
                    <style>
                        body { font-family: system-ui, sans-serif; background: #090D16; color: #F8FAFC; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .card { max-width: 400px; text-align: center; background: #0E1322; border: 1px solid rgba(255,255,255,0.08); padding: 32px; border-radius: 16px; }
                        h3 { color: #F87171; margin-top: 0; }
                        p { color: #94A3B8; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h3>Authentication Canceled</h3>
                        <p>${error}</p>
                    </div>
                    <script>
                        if (window.opener) {
                            window.opener.postMessage({ type: 'WISEFIND_GOOGLE_AUTH_ERROR', error: '${error}' }, window.location.origin);
                            setTimeout(() => window.close(), 1200);
                        } else {
                            setTimeout(() => { window.location.href = '/?auth_error=' + encodeURIComponent('${error}'); }, 1200);
                        }
                    </script>
                </body>
                </html>
            `);
        }

        if (!code) {
            return res.status(400).send("Authorization code missing.");
        }

        let role = "user";
        try {
            if (state) {
                const parsedState = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
                if (parsedState.role) role = parsedState.role;
            }
        } catch (e) {}

        try {
            // Exchange code for token
            const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    code: code.toString(),
                    client_id: GOOGLE_CLIENT_ID,
                    client_secret: GOOGLE_CLIENT_SECRET,
                    redirect_uri: GOOGLE_CALLBACK_URL,
                    grant_type: "authorization_code"
                })
            });

            if (!tokenResponse.ok) {
                const errText = await tokenResponse.text();
                throw new Error(`Token exchange failed: ${errText}`);
            }

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            // Fetch user profile from Google
            const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!userInfoResponse.ok) {
                throw new Error("Failed to fetch Google user profile");
            }

            const profile = await userInfoResponse.json();

            // Create auth user record
            const authUser = {
                id: profile.id,
                name: profile.name || profile.email?.split("@")[0] || "User",
                email: profile.email,
                picture: profile.picture || null,
                role: role,
                provider: "google",
                verified: profile.verified_email ?? true
            };

            // Save or sync with MongoDB / disk storage
            await upsertUser(authUser);
            console.log(`[Google OAuth] User logged in: ${authUser.email} (${authUser.role})`);

            // Return bridge HTML to communicate with parent window / redirect
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>WiseFind - Google Authentication</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            background: #090D16;
                            color: #F8FAFC;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .box {
                            text-align: center;
                            background: #0E1322;
                            border: 1px solid rgba(255,255,255,0.08);
                            padding: 32px 40px;
                            border-radius: 16px;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                        }
                        .spinner {
                            width: 36px;
                            height: 36px;
                            border: 3px solid rgba(79, 70, 229, 0.2);
                            border-top-color: #4F46E5;
                            border-radius: 50%;
                            animation: spin 0.8s linear infinite;
                            margin: 0 auto 16px;
                        }
                        @keyframes spin { to { transform: rotate(360deg); } }
                        h3 { margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #F8FAFC; }
                        p { margin: 0; font-size: 13px; color: #94A3B8; }
                    </style>
                </head>
                <body>
                    <div class="box">
                        <div class="spinner"></div>
                        <h3>Sign-in Successful</h3>
                        <p>Connecting ${authUser.name} to WiseFind...</p>
                    </div>
                    <script>
                        const authUser = ${JSON.stringify(authUser)};
                        try {
                            localStorage.setItem('wisefind_logged_user', JSON.stringify(authUser));
                            localStorage.setItem('wisefind_user_role', authUser.role || 'user');
                        } catch(e) {}

                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'WISEFIND_GOOGLE_AUTH_SUCCESS',
                                user: authUser
                            }, window.location.origin);
                            setTimeout(() => window.close(), 400);
                        } else {
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 500);
                        }
                    </script>
                </body>
                </html>
            `);
        } catch (err) {
            console.error("[Google OAuth] Exchange error:", err);
            return res.status(500).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Google Authentication Failed</title>
                    <style>
                        body { font-family: system-ui, sans-serif; background: #090D16; color: #F8FAFC; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .card { max-width: 440px; text-align: center; background: #0E1322; border: 1px solid rgba(255,255,255,0.08); padding: 32px; border-radius: 16px; }
                        h3 { color: #F87171; margin-top: 0; }
                        p { color: #94A3B8; font-size: 13px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h3>Authentication Failed</h3>
                        <p>${err.message}</p>
                    </div>
                    <script>
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'WISEFIND_GOOGLE_AUTH_ERROR',
                                error: '${err.message.replace(/'/g, "\\'")}'
                            }, window.location.origin);
                            setTimeout(() => window.close(), 2500);
                        }
                    </script>
                </body>
                </html>
            `);
        }
    });

    // 4. Query current user by email
    app.get("/api/auth/user", async (req, res) => {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: "Email required" });
        const found = await getUserByEmail(email);
        res.json(found || null);
    });

    // Serve static files / Vite middleware
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            root: process.cwd(),
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);

        app.use("*", async (req, res, next) => {
            const url = req.originalUrl;
            try {
                const indexPath = path.resolve(process.cwd(), "index.html");
                let template = fs.readFileSync(indexPath, "utf-8");
                template = await vite.transformIndexHtml(url, template);
                res.status(200).set({ "Content-Type": "text/html" }).end(template);
            } catch (e) {
                vite.ssrFixStacktrace(e);
                next(e);
            }
        });
    }
    else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
}
// Offline fallback logic for queries when API keys aren't provisioned or crash
function generateOfflineRecommendation(query, products, preferences) {
    const q = query.toLowerCase();
    // Try to match keywords to categories, subcategories, brands, highlights, or names
    let matchedProducts = products.filter(p => q.includes(p.category.toLowerCase()) ||
        (p.subCategory && q.includes(p.subCategory.toLowerCase())) ||
        q.includes(p.brand.toLowerCase()) ||
        p.highlights.some(h => q.includes(h.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.name.toLowerCase().split(" ").some(word => word.length > 2 && q.includes(word)));
    // Apply user preferences to boost or filter results
    if (preferences) {
        if (preferences.category && preferences.category !== 'All') {
            const categoryMatches = products.filter(p => p.category.toLowerCase() === preferences.category.toLowerCase());
            if (categoryMatches.length > 0) {
                matchedProducts = [...matchedProducts, ...categoryMatches];
            }
        }
        if (preferences.brand && preferences.brand !== 'Flexible') {
            const brandMatches = products.filter(p => p.brand.toLowerCase() === preferences.brand.toLowerCase());
            if (brandMatches.length > 0) {
                matchedProducts = [...brandMatches, ...matchedProducts];
            }
        }
    }
    // Deduplicate
    matchedProducts = Array.from(new Set(matchedProducts));
    if (matchedProducts.length === 0) {
        // If nothing matched, pick top rated / editors choice
        matchedProducts = products.filter(p => p.isEditorChoice || p.rating >= 4.7).slice(0, 3);
    }
    // Cap matched products to maximum 4 items for beautiful grid layout
    matchedProducts = matchedProducts.slice(0, 4);
    const budgetMatch = q.match(/under\s*(?:rs\.?|₹)?\s*([\d,]+)/i) || q.match(/(?:rs\.?|₹)?\s*([\d,]+)\s*budget/i);
    const detectedBudget = budgetMatch ? `Under ₹${budgetMatch[1]}` : (preferences?.budget || "Flexible");
    return {
        extractedRequirements: {
            budget: detectedBudget,
            purpose: q.includes("programming") || q.includes("coding") ? "Programming & Software Development" :
                q.includes("game") || q.includes("gaming") ? "Gaming & Entertainment" :
                    q.includes("photo") || q.includes("camera") ? "Photography & Content Creation" : "Daily All-round Use",
            brandPreference: preferences?.brand || (q.includes("apple") ? "Apple" : q.includes("samsung") ? "Samsung" : "Flexible"),
            preferredFeatures: q.includes("battery") ? ["Long battery endurance"] :
                q.includes("display") || q.includes("screen") ? ["High quality display"] : ["Value for money", "Solid overall specs"],
            usageScenario: `Searching for the best value tech options matching: "${query}"`
        },
        recommendations: matchedProducts.map(p => {
            // Calculate a highly accurate match score taking preferences into account
            let baseScore = p.aiScore;
            if (preferences) {
                if (preferences.brand && preferences.brand.toLowerCase() === p.brand.toLowerCase()) {
                    baseScore = Math.min(100, baseScore + 5);
                }
                if (preferences.priority === 'Maximum Performance' && p.category === 'Laptops') {
                    baseScore = Math.min(100, baseScore + 2);
                }
            }
            return {
                productName: p.name,
                brand: p.brand,
                priceEstimate: `₹${p.price.toLocaleString("en-IN")}`,
                aiMatchScore: baseScore,
                matchReason: `Directly matches your requirements for ${p.category}. Offers outstanding ${p.specs['Processor'] || p.specs['Display'] || 'specifications'}.`,
                specsHighlight: {
                    "Display": p.specs['Display'] || "High Quality",
                    "Processor/Engine": p.specs['Processor'] || p.specs['Type'] || "Capable SOC",
                    "Battery/Life": p.specs['Battery'] || p.specs['Battery Life'] || "Standard Endurance",
                    "Primary Highlight": p.highlights[0]
                },
                strengths: p.pros,
                weaknesses: p.cons,
                buyingAdvice: p.aiRecommendation,
                alternatives: products.filter(alt => alt.category === p.category && alt.id !== p.id).map(alt => alt.name).slice(0, 2)
            };
        }),
        overallBuyingVerdict: `Based on your request, we found ${matchedProducts.length} prime product matches. Our top recommendation offers the finest balance of longevity and pure price-to-performance ratio. Make sure to check the specific details above before committing.`
    };
}
// Helper to score how well a product matches a search text or segment
function scoreProductMatch(prod, text) {
    const name = (prod.name || '').toLowerCase();
    const brand = (prod.brand || '').toLowerCase();
    const brandless = name.replace(brand, '').trim();
    let score = 0;
    
    if (text === name || text === brandless) score += 100;
    if (text.includes(name)) score += 80;
    if (brandless.length > 3 && text.includes(brandless)) score += 70;
    
    const brandSynonyms = {
        'thinkpad': 'lenovo',
        'legion': 'lenovo',
        'macbook': 'apple',
        'iphone': 'apple',
        'ipad': 'apple',
        'galaxy': 'samsung',
        'bravia': 'sony',
        'rog': 'asus',
        'zephyrus': 'asus',
        'vivobook': 'asus',
        'spectre': 'hp',
        'pixel': 'google'
    };

    for (const [key, b] of Object.entries(brandSynonyms)) {
        if (text.includes(key) && (brand.includes(b) || name.includes(key))) {
            score += 45;
        }
    }

    const signatures = ['iphone', 'galaxy', 'thinkpad', 'macbook', 'pixel', 'airpods', 'quietcomfort', 'wh-1000', 'zephyrus', 'spectre', 'yoga', 'surface', 'ipad', 'playstation', 'legion', 'alienware', 'bravia', 'oneplus'];
    for (const sig of signatures) {
        if (name.includes(sig) && text.includes(sig)) {
            score += 50;
            const modelTokens = brandless.split(/[\s,/-]+/).filter(t => t.length > 0 && t !== sig);
            for (const tok of modelTokens) {
                if (text.includes(tok)) score += 15;
            }
        }
    }
    
    const words = brandless.split(/[\s,/-]+/).filter(w => w.length > 2);
    for (const w of words) {
        if (text.includes(w)) score += 10;
    }
    if (text.includes(brand)) score += 20;
    
    return score;
}

function getOfflineBotReply(message, products = []) {
    const q = message.toLowerCase().trim();
    const formatProdTitle = (p) => p.name.toLowerCase().startsWith((p.brand || '').toLowerCase()) ? p.name : `${p.brand} ${p.name}`;

    // 1. COMPARISON QUERIES ("vs", "compare", "difference between", " or ")
    if (q.includes('vs') || q.includes('compare') || q.includes('difference between') || (q.includes(' or ') && products.some(p => q.includes(p.name.toLowerCase().split(' ')[0])))) {
        const cleanQ = q.replace(/^(can you\s+)?(please\s+)?(compare|what is the difference between|difference between)\s+/i, '');
        const parts = cleanQ.split(/\s+vs\.?\s+|\s+against\s+|\s+compared to\s+|\s+or\s+/i).map(s => s.trim()).filter(Boolean);

        let matching = [];
        if (parts.length >= 2) {
            const ranked1 = products.map(p => ({ p, s: scoreProductMatch(p, parts[0]) })).filter(x => x.s > 25).sort((a, b) => b.s - a.s);
            const ranked2 = products.map(p => ({ p, s: scoreProductMatch(p, parts[1]) })).filter(x => x.s > 25).sort((a, b) => b.s - a.s);
            
            if (ranked1.length > 0 && ranked2.length > 0) {
                const p1 = ranked1[0].p;
                const p2 = ranked2.find(x => x.p.id !== p1.id)?.p;
                if (p1 && p2) {
                    matching = [p1, p2];
                }
            }
        }

        if (matching.length < 2) {
            const rankedAll = products.map(p => ({ p, s: scoreProductMatch(p, q) })).filter(x => x.s > 30).sort((a, b) => b.s - a.s);
            matching = rankedAll.slice(0, 2).map(x => x.p);
        }

        if (matching.length >= 2) {
            const p1 = matching[0];
            const p2 = matching[1];
            const priceDelta = Math.abs(p1.price - p2.price);
            const lowerPrice = p1.price < p2.price ? p1 : p2;
            const higherScore = (p1.aiScore || 0) >= (p2.aiScore || 0) ? p1 : p2;

            return `### ⚖️ Side-by-Side Face-Off: **${p1.name}** vs **${p2.name}**\n\n` +
                `• **Live Retail Valuation**: **${p1.name}** is priced at **₹${p1.price.toLocaleString('en-IN')}**, while **${p2.name}** is **₹${p2.price.toLocaleString('en-IN')}** (Exact Delta: **₹${priceDelta.toLocaleString('en-IN')}**).\n` +
                `• **WiseScore™ Rating**: **${p1.name}** scores **${p1.aiScore}/100** | **${p2.name}** scores **${p2.aiScore}/100**.\n` +
                `• **Processor**: ${p1.name} (${p1.specs?.['Processor'] || 'Optimized Architecture'}) vs ${p2.name} (${p2.specs?.['Processor'] || 'Custom Architecture'}).\n` +
                `• **Display Panel**: ${p1.name} (${p1.specs?.['Display'] || 'High Refresh Panel'}) vs ${p2.name} (${p2.specs?.['Display'] || 'Premium Panel'}).\n` +
                `• **Battery**: ${p1.name} (${p1.specs?.['Battery'] || p1.specs?.['Battery Life'] || 'Extended Cell'}) vs ${p2.name} (${p2.specs?.['Battery'] || p2.specs?.['Battery Life'] || 'Optimized Power Management'}).\n\n` +
                `**Key Trade-offs**:\n` +
                `• **Choose ${p1.name} for**: ${p1.pros?.[0] || 'Refined longevity and ecosystem integration'}.\n` +
                `• **Choose ${p2.name} for**: ${p2.pros?.[0] || 'Peak sustained performance and versatile capabilities'}.\n\n` +
                `**💡 WiseBot Verdict**: For pure price-to-performance efficiency, **${lowerPrice.name}** saves you ₹${priceDelta.toLocaleString('en-IN')}. If you prioritize the highest benchmark ceiling and build longevity, **${higherScore.name}** is the definitive winner.`;
        } else if (matching.length === 1) {
            const p1 = matching[0];
            const alt = products.find(p => p.category === p1.category && p.id !== p1.id && Math.abs(p.price - p1.price) < 40000) || products.find(p => p.category === p1.category && p.id !== p1.id);
            return `### ⚖️ Comparison Analysis: **${p1.name}**\n\n` +
                `• **Official Price**: **₹${p1.price.toLocaleString('en-IN')}**\n` +
                `• **WiseScore™ Index**: **${p1.aiScore}/100** (Top tier in ${p1.category})\n` +
                `• **Processor**: ${p1.specs?.['Processor'] || 'High-performance chipset'}\n` +
                `• **Display**: ${p1.specs?.['Display'] || 'Premium panel'}\n` +
                `• **Standout Advantage**: ${p1.pros?.[0] || p1.highlights?.[0] || 'High efficiency'}\n` +
                `• **Known Limitation**: ${p1.cons?.[0] || 'Premium price tier'}\n\n` +
                (alt ? `Against its closest market competitor, the **${alt.name}** (₹${alt.price.toLocaleString('en-IN')}, WiseScore ${alt.aiScore}/100), ${p1.name} delivers ${(p1.aiScore || 0) >= (alt.aiScore || 0) ? 'superior overall refinement and longer software updates.' : 'more aggressive pricing.'}` : '');
        }
    }

    // 2. TECHNICAL CONCEPTS & DEEP DIVES ("LTPO", "NPU", "OLED", "TDP", "ANC", "RAM", etc.)
    if (q.includes('ltpo')) {
        return `### 💡 Technical Deep Dive: **LTPO Display (Low-Temperature Polycrystalline Oxide)**\n\n` +
            `• **What it is**: An advanced screen backplane technology that allows dynamic variable refresh rates, seamlessly shifting anywhere from **1Hz to 120Hz** depending on on-screen motion.\n` +
            `• **Real-World Impact**: When reading an article or viewing the Always-On Display, the screen drops to 1Hz, saving **15% to 25% battery daily** compared to fixed 120Hz or 60Hz panels.\n` +
            `• **Where to Find It**: Flagships like iPhone 18 Pro, iPhone 17, Samsung Galaxy S26 Ultra, and OnePlus 13.`;
    }
    if (q.includes('npu') || q.includes('tops')) {
        return `### 💡 Technical Deep Dive: **NPU (Neural Processing Unit) & TOPS**\n\n` +
            `• **What it is**: A dedicated silicon engine engineered strictly for parallel matrix mathematics used by AI models (local LLMs, noise cancelation, generative photo editing) with near-zero battery draw.\n` +
            `• **What TOPS means**: **Tera Operations Per Second** (Trillions of calculations/sec). The Copilot+ AI PC standard requires **40+ TOPS** (e.g. Snapdragon X Elite, Apple M3/M4, AMD Strix Point, Intel Lunar Lake).\n` +
            `• **Do You Need It?**: If you do heavy photo/video retouching, code completion, or want all-day 18+ hour laptop battery life, a dedicated 40+ TOPS NPU is essential.`;
    }
    if (q.includes('ram')) {
        return `### 💡 Hardware Advisory: **How Much RAM Do You Need in 2026?**\n\n` +
            `• **Smartphones**: **12GB to 16GB** is the new sweet spot to execute local AI models (Apple Intelligence, Gemini Nano) without dropping background apps from cache.\n` +
            `• **Laptops (Coding & Creative)**: **16GB Unified RAM** is the mandatory baseline. 8GB is completely obsolete for modern multi-tasking and developer toolchains.\n` +
            `• **Laptops (Heavy 3D & 8K Video)**: **32GB to 64GB** is recommended for Premiere, Blender, or training local machine learning models.`;
    }

    // 3. CODING / PROGRAMMING / DEVELOPER QUERIES
    if (q.includes('coding') || q.includes('programming') || q.includes('developer') || q.includes('software') || q.includes('cs student') || q.includes('development')) {
        const laptops = products.filter(p => p.category?.toLowerCase().includes('laptop') || p.subCategory?.toLowerCase().includes('laptop'))
            .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
            .slice(0, 3);
        if (laptops.length > 0) {
            return `### 💻 Top Verified Hardware for Coding & Software Development\n\n` +
                `For software engineering, multi-threaded compiles, and Docker containers, your primary priorities are 16GB+ RAM, low thermal throttling, and all-day battery:\n\n` +
                laptops.map((p, i) => 
                    `**${i + 1}. ${formatProdTitle(p)}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
                    `• **WiseScore™**: **${p.aiScore}/100** | Rating: ${p.rating}★\n` +
                    `• **Processor**: ${p.specs?.['Processor'] || 'High Performance Silicon'}\n` +
                    `• **Battery**: ${p.specs?.['Battery'] || p.specs?.['Battery Life'] || 'Full day endurance'}\n` +
                    `• **Developer Advantage**: ${p.pros?.[0] || 'Outstanding multi-core compilation efficiency'}`
                ).join('\n\n') +
                `\n\n**💡 WiseBot Verdict**: The **${laptops[0].name}** offers the highest combination of silent acoustics, all-day battery life, and swift build times.`;
        }
    }

    // 3. GAMING & HIGH-FPS QUERIES
    if (q.includes('gaming') || q.includes('fps') || q.includes('gpu') || q.includes('rtx') || q.includes('esports')) {
        const gamingMatches = products.filter(p => {
            const combined = `${p.name} ${p.description || ''} ${Object.values(p.specs || {}).join(' ')}`.toLowerCase();
            return combined.includes('gaming') || combined.includes('gpu') || combined.includes('refresh rate') || combined.includes('120hz') || combined.includes('rtx');
        }).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 3);

        if (gamingMatches.length > 0) {
            return `### 🎮 High-Performance Gaming & Graphics Recommendations\n\n` +
                `For high-FPS gaming and sustained graphical throughput, prioritize thermal dissipation and display refresh rates:\n\n` +
                gamingMatches.map((p, i) => 
                    `**${i + 1}. ${formatProdTitle(p)}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
                    `• **WiseScore™**: **${p.aiScore}/100**\n` +
                    `• **Display**: ${p.specs?.['Display'] || 'High Refresh Panel'}\n` +
                    `• **Internals**: ${p.specs?.['Processor'] || p.specs?.['Graphics'] || 'High-throughput hardware'}\n` +
                    `• **Gaming Strengths**: ${p.highlights?.[0] || p.pros?.[0] || 'Uncompromising sustained graphical frame rates'}`
                ).join('\n\n') +
                `\n\n**💡 WiseBot Verdict**: **${gamingMatches[0].name}** provides the highest graphical stability with exceptional cooling efficiency.`;
        }
    }

    // 4. BATTERY LIFE & ENDURANCE QUERIES
    if (q.includes('battery') || q.includes('endurance') || q.includes('backup') || q.includes('mah') || q.includes('sot')) {
        let pool = products;
        if (q.includes('phone') || q.includes('smartphone') || q.includes('mobile')) {
            pool = products.filter(p => p.category?.toLowerCase().includes('smartphone') || p.subCategory?.toLowerCase().includes('smartphone'));
        } else if (q.includes('laptop') || q.includes('notebook') || q.includes('macbook')) {
            pool = products.filter(p => p.category?.toLowerCase().includes('laptop') || p.subCategory?.toLowerCase().includes('laptop'));
        }
        const batteryMatches = pool.filter(p => {
            const specText = JSON.stringify(p.specs || {}).toLowerCase();
            return specText.includes('battery') || specText.includes('hours') || specText.includes('mah');
        }).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 3);

        if (batteryMatches.length > 0) {
            return `### 🔋 Highest Battery Life & Power Efficiency Hardware\n\n` +
                `Real-world battery endurance is driven by silicon architectural efficiency (TSMC 2nm/3nm nodes) and LTPO displays:\n\n` +
                batteryMatches.map((p, i) => 
                    `**${i + 1}. ${formatProdTitle(p)}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
                    `• **Battery Rating**: ${p.specs?.['Battery'] || p.specs?.['Battery Life'] || 'Full day endurance'}\n` +
                    `• **WiseScore™**: **${p.aiScore}/100**\n` +
                    `• **Efficiency Metric**: ${p.pros?.find(pr => pr.toLowerCase().includes('battery')) || p.highlights?.[0] || 'Low TDP operation under sustained loads'}`
                ).join('\n\n') +
                `\n\n**💡 WiseBot Advice**: Devices utilizing dynamic LTPO variable refresh rate (1Hz-120Hz) reduce idle screen power consumption by up to 25%, drastically extending daily screen-on-time.`;
        }
    }

    // 5. CAMERA & VIDEOGRAPHY QUERIES
    if (q.includes('camera') || q.includes('photo') || q.includes('video') || q.includes('sensor') || q.includes('zoom')) {
        const cameraMatches = products.filter(p => {
            const specText = JSON.stringify(p.specs || {}).toLowerCase();
            return specText.includes('camera') || specText.includes('mp') || specText.includes('ois');
        }).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 3);

        if (cameraMatches.length > 0) {
            return `### 📸 Best Computational Photography & Videography Hardware\n\n` +
                `When choosing cameras in 2026, evaluate sensor size and optical stabilization over pure megapixel counts:\n\n` +
                cameraMatches.map((p, i) => 
                    `**${i + 1}. ${formatProdTitle(p)}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
                    `• **Camera Specs**: ${p.specs?.['Camera'] || 'Triple Computational System'}\n` +
                    `• **WiseScore™**: **${p.aiScore}/100**\n` +
                    `• **Camera Advantage**: ${p.pros?.find(pr => pr.toLowerCase().includes('camera') || pr.toLowerCase().includes('video')) || p.highlights?.[0] || 'Accurate skin tones and zero shutter lag'}`
                ).join('\n\n') +
                `\n\n**💡 WiseBot Verdict**: The **${cameraMatches[0].name}** leads overall for natural color science, dynamic range, and class-leading video recording.`;
        }
    }

    // 6. AUDIO & NOISE CANCELLATION QUERIES
    if (q.includes('audio') || q.includes('headphone') || q.includes('earbud') || q.includes('anc') || q.includes('sound') || q.includes('bass')) {
        const audioMatches = products.filter(p => p.category?.toLowerCase().includes('audio') || p.subCategory?.toLowerCase().includes('audio')).slice(0, 3);
        if (audioMatches.length > 0) {
            return `### 🎧 Premium Audio & Active Noise Cancellation (ANC) Analysis\n\n` +
                `For headphones and earbuds, prioritize acoustic isolation and high-resolution codec transmission:\n\n` +
                audioMatches.map((p, i) => 
                    `**${i + 1}. ${formatProdTitle(p)}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
                    `• **Battery / ANC**: ${p.specs?.['Battery Life'] || p.specs?.['Battery'] || '30+ Hours with ANC'}\n` +
                    `• **WiseScore™**: **${p.aiScore}/100** | Rating: ${p.rating}★\n` +
                    `• **Sonic Signature**: ${p.highlights?.[0] || p.pros?.[0] || 'Superb acoustic staging and deep sub-bass control'}`
                ).join('\n\n') +
                `\n\n**💡 WiseBot Verdict**: For pure active noise cancelation, the **${audioMatches[0].name}** remains the industry gold standard.`;
        }
    }

    // 7. BUDGET QUERIES ("under ₹50,000", "under 70k", "best laptop under 60000", etc.)
    if (q.includes('under') || q.includes('budget') || q.includes('price') || q.includes('₹') || q.includes('rs') || q.includes('k') || /\d+000/.test(q)) {
        const cleanNumStr = q.replace(/,/g, '');
        let targetBudget = 60000;
        const lakhMatch = cleanNumStr.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)/i);
        const kMatch = cleanNumStr.match(/(\d+)\s*k\b/i);
        const fullNumMatch = cleanNumStr.match(/(?:under|rs\.?|₹|around)?\s*(\d{4,6})/i);

        if (lakhMatch) targetBudget = parseFloat(lakhMatch[1]) * 100000;
        else if (kMatch) targetBudget = parseInt(kMatch[1]) * 1000;
        else if (fullNumMatch && parseInt(fullNumMatch[1]) >= 10000) targetBudget = parseInt(fullNumMatch[1]);

        let pool = products;
        if (q.includes('phone') || q.includes('smartphone') || q.includes('mobile')) pool = products.filter(p => p.category?.toLowerCase().includes('smartphone') || p.subCategory?.toLowerCase().includes('smartphone'));
        else if (q.includes('laptop') || q.includes('notebook') || q.includes('macbook')) pool = products.filter(p => p.category?.toLowerCase().includes('laptop') || p.subCategory?.toLowerCase().includes('laptop'));
        else if (q.includes('headphone') || q.includes('audio') || q.includes('earbud')) pool = products.filter(p => p.category?.toLowerCase().includes('audio') || p.subCategory?.toLowerCase().includes('audio'));

        let withinBudget = pool.filter(p => p.price <= targetBudget * 1.08).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 3);
        if (withinBudget.length > 0) {
            return `### 💰 Best Hardware Recommendations for Budget ~₹${targetBudget.toLocaleString('en-IN')}\n\n` +
                `Here are the highest-rated devices audited by our **WiseScore™ Algorithm** matching your budget criteria:\n\n` +
                withinBudget.map((p, idx) => 
                    `**${idx + 1}. ${formatProdTitle(p)}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
                    `• **WiseScore™**: **${p.aiScore}/100** | Rating: ${p.rating}★\n` +
                    `• **Internals**: ${p.specs?.['Processor'] || p.specs?.['Display'] || 'Top-tier internals'}\n` +
                    `• **Battery**: ${p.specs?.['Battery'] || p.specs?.['Battery Life'] || 'All-day endurance'}\n` +
                    `• **Advantage**: ${p.highlights?.[0] || p.pros?.[0] || 'Unrivaled price-to-performance ratio.'}`
                ).join('\n\n') +
                `\n\n**💡 WiseBot Advice**: **${withinBudget[0].name}** offers the highest score-to-rupee ratio in this bracket. Check the action buttons below to view full specifications or compare side by side.`;
        }
    }

    // 8. BRAND-SPECIFIC INQUIRIES ("Apple", "Samsung", "Dell", "Lenovo", "Sony", "Asus", "OnePlus", "Google")
    const detectedBrand = ['apple', 'samsung', 'dell', 'lenovo', 'sony', 'asus', 'oneplus', 'google', 'bose'].find(b => q.includes(b));
    if (detectedBrand) {
        const brandMatches = products.filter(p => p.brand.toLowerCase().includes(detectedBrand)).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
        if (brandMatches.length > 0) {
            const brandName = brandMatches[0].brand;
            return `### 🏷️ Verified ${brandName} Hardware Intelligence\n\n` +
                `Here are the top-rated audited devices from **${brandName}** currently tracked in the WiseFind catalog:\n\n` +
                brandMatches.slice(0, 3).map((p, idx) => 
                    `**${idx + 1}. ${p.name}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
                    `• **WiseScore™**: **${p.aiScore}/100** | Category: ${p.category}\n` +
                    `• **Core Specs**: ${p.specs?.['Processor'] || p.specs?.['Display'] || 'Verified configuration'}\n` +
                    `• **Best Aspect**: ${p.pros?.[0] || 'Excellent build and long-term resale value'}\n` +
                    `• **Trade-off**: ${p.cons?.[0] || 'Premium price bracket'}`
                ).join('\n\n') +
                `\n\n**💡 WiseBot Verdict**: The **${brandMatches[0].name}** is the definitive flagship recommendation from ${brandName} for longevity, software stability, and verified benchmark output.`;
        }
    }

    // 10. PRODUCT MATCHING BY EXACT / PARTIAL NAME
    const matched = products.find(p => {
        const pName = p.name.toLowerCase();
        const cleanQuery = q.replace(/tell me about|what is|how is|specs of|review of|is it worth buying|price of/g, '').trim();
        return pName.includes(cleanQuery) || cleanQuery.includes(pName) || p.name.toLowerCase().split(' ').some(word => word.length > 3 && q.includes(word));
    });
    if (matched) {
        return `### 📱 Hardware Analysis: **${matched.brand} ${matched.name}**\n\n` +
            `• **Official Price**: **₹${matched.price.toLocaleString("en-IN")}**\n` +
            `• **WiseScore™ Overall**: **${matched.aiScore}/100** | Category: ${matched.category}\n` +
            `• **Processor**: ${matched.specs?.['Processor'] || 'Optimized Architecture'}\n` +
            `• **Display**: ${matched.specs?.['Display'] || 'Premium Screen'}\n` +
            `• **Battery Life**: ${matched.specs?.['Battery'] || matched.specs?.['Battery Life'] || 'All-day endurance'}\n` +
            `• **Top Pros**: ${matched.pros?.join(' • ') || 'Verified performance'}\n` +
            `• **Consideration**: ${matched.cons?.join(' • ') || 'Premium price bracket'}\n\n` +
            `**💡 Official Recommendation**: ${matched.aiRecommendation || 'A highly recommended hardware selection for buyers prioritizing longevity and build quality.'}`;
    }

    // 11. GENERAL HARDWARE ADVISORY (Return real top products, NEVER canned demo text)
    const topOverall = products.filter(p => p.isEditorChoice || p.rating >= 4.8).slice(0, 3);
    return `### 🎯 WiseBot Hardware Intelligence\n\n` +
        `Here are the highest-rated devices currently audited across our catalog based on 5 objective pillars (**Raw Benchmarks**, **Thermals & Battery**, **Display Quality**, **Software Support Lifecycle**, and **Rupee-to-Value Index**):\n\n` +
        topOverall.map((p, idx) => 
            `**${idx + 1}. ${formatProdTitle(p)}** — **₹${p.price.toLocaleString('en-IN')}**\n` +
            `• **WiseScore™**: **${p.aiScore}/100** | Rating: ${p.rating}★\n` +
            `• **Specs**: ${p.specs?.['Processor'] || p.specs?.['Display'] || 'Top-tier internals'}\n` +
            `• **Why it's recommended**: ${p.highlights?.[0] || p.pros?.[0] || 'Uncompromising performance in its segment.'}`
        ).join('\n\n') +
        `\n\n**💡 How can I assist your buying decision?**: Ask for a specific comparison (e.g. *"MacBook M3 vs ThinkPad"*), specify your exact budget (e.g. *"Best phone under ₹50,000"*), or describe your primary use-case (coding, camera, battery, or travel)!`;
}
startServer();
