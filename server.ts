import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { Product, BuyingGuide } from "./src/types";
import { INITIAL_PRODUCTS, INITIAL_BUYING_GUIDES } from "./src/data/mockData";

dotenv.config();

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

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
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Running in mock-AI mode.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Filesystem Database paths
  const dbDir = path.join(process.cwd(), "db_storage");
  const productsDbPath = path.join(dbDir, "products.json");
  const guidesDbPath = path.join(dbDir, "guides.json");

  // Ensure DB directory and files exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  let productsList: Product[] = [];
  let guidesList: BuyingGuide[] = [];

  // Load products
  if (fs.existsSync(productsDbPath)) {
    try {
      productsList = JSON.parse(fs.readFileSync(productsDbPath, "utf-8"));
      let updated = false;
      for (const p of INITIAL_PRODUCTS) {
        if (!productsList.some(item => item.id === p.id)) {
          productsList.push(p);
          updated = true;
        }
      }
      if (updated) {
        fs.writeFileSync(productsDbPath, JSON.stringify(productsList, null, 2));
      }
    } catch (e) {
      console.error("Error reading products DB, resetting to defaults", e);
      productsList = [...INITIAL_PRODUCTS];
      fs.writeFileSync(productsDbPath, JSON.stringify(productsList, null, 2));
    }
  } else {
    productsList = [...INITIAL_PRODUCTS];
    fs.writeFileSync(productsDbPath, JSON.stringify(productsList, null, 2));
  }

  // Load guides
  if (fs.existsSync(guidesDbPath)) {
    try {
      guidesList = JSON.parse(fs.readFileSync(guidesDbPath, "utf-8"));
      let updated = false;
      for (const g of INITIAL_BUYING_GUIDES) {
        if (!guidesList.some(item => item.id === g.id)) {
          guidesList.push(g);
          updated = true;
        }
      }
      if (updated) {
        fs.writeFileSync(guidesDbPath, JSON.stringify(guidesList, null, 2));
      }
    } catch (e) {
      console.error("Error reading guides DB, resetting to defaults", e);
      guidesList = [...INITIAL_BUYING_GUIDES];
      fs.writeFileSync(guidesDbPath, JSON.stringify(guidesList, null, 2));
    }
  } else {
    guidesList = [...INITIAL_BUYING_GUIDES];
    fs.writeFileSync(guidesDbPath, JSON.stringify(guidesList, null, 2));
  }

  // Helper to save DBs
  const saveProducts = () => {
    fs.writeFileSync(productsDbPath, JSON.stringify(productsList, null, 2));
  };
  const saveGuides = () => {
    fs.writeFileSync(guidesDbPath, JSON.stringify(guidesList, null, 2));
  };

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiEnabled: !!ai });
  });

  // Get all products
  app.get("/api/products", (req, res) => {
    res.json(productsList);
  });

  // Add product (Admin)
  app.post("/api/products", (req, res) => {
    const productData = req.body;
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      rating: parseFloat(productData.rating) || 4.5,
      price: parseInt(productData.price) || 0,
      aiScore: parseInt(productData.aiScore) || 85,
    };
    productsList.unshift(newProduct);
    saveProducts();
    res.status(201).json(newProduct);
  });

  // Update product (Admin)
  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = productsList.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    productsList[index] = {
      ...productsList[index],
      ...req.body,
      id // preserve ID
    };
    saveProducts();
    res.json(productsList[index]);
  });

  // Delete product (Admin)
  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = productsList.length;
    productsList = productsList.filter(p => p.id !== id);
    if (productsList.length === initialLength) {
      return res.status(404).json({ error: "Product not found" });
    }
    saveProducts();
    res.json({ success: true, id });
  });

  // Get buying guides
  app.get("/api/guides", (req, res) => {
    res.json(guidesList);
  });

  // Create guide (Admin)
  app.post("/api/guides", (req, res) => {
    const guideData = req.body;
    const newGuide: BuyingGuide = {
      ...guideData,
      id: `guide-${Date.now()}`,
    };
    guidesList.unshift(newGuide);
    saveGuides();
    res.status(201).json(newGuide);
  });

  // AI Buying Intelligence Recommendation Endpoint with Search Grounding
  app.post("/api/recommend", async (req, res) => {
    const { query, preferences } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

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
    } catch (err) {
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

    if (!ai) {
      // Mock WiseBot chat logic
      const reply = getOfflineBotReply(message, productsList);
      return res.json({ text: reply });
    }

    try {
      console.log("Invoking WiseBot chat session with Gemini...");
      
      const formattedHistory = (history || []).map((msg: any) => ({
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
    } catch (err) {
      console.error("WiseBot error, using fallback replies", err);
      const reply = getOfflineBotReply(message, productsList);
      res.json({ text: reply });
    }
  });


  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
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
function generateOfflineRecommendation(query: string, products: Product[], preferences?: any) {
  const q = query.toLowerCase();
  
  // Try to match keywords to categories or brands
  let matchedProducts = products.filter(p => 
    q.includes(p.category.toLowerCase()) || 
    q.includes(p.brand.toLowerCase()) ||
    p.highlights.some(h => q.includes(h.toLowerCase())) ||
    p.name.toLowerCase().split(" ").some(word => word.length > 3 && q.includes(word))
  );

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

function getOfflineBotReply(message: string, products: Product[]): string {
  const m = message.toLowerCase();
  if (m.includes("hello") || m.includes("hi ") || m.includes("hey")) {
    return "Hello! I am WiseBot, your WiseFind Buying Intelligence Assistant. How can I help you compare, select, or decode product specifications today?";
  }
  
  if (m.includes("compare") || m.includes("difference")) {
    return "To compare items, simply check the comparison box on our product cards, then click 'Compare Now' in the bottom comparative drawer to see a complete spec-by-spec and AI-driven breakdown of their features, strengths, and trade-offs!";
  }

  // Look for product matches
  const matched = products.find(p => m.includes(p.name.toLowerCase()) || m.includes(p.brand.toLowerCase()));
  if (matched) {
    return `Ah, you are asking about the **${matched.name}**! It is a stellar choice in the **${matched.category}** category, currently priced around ₹${matched.price.toLocaleString("en-IN")}. Our AI rates it at a solid **${matched.aiScore}/100** on buying intelligence. \n\nKey Strength: ${matched.pros[0]}. \nConsideration: ${matched.cons[0]}. \n\nWould you like me to compare it to another model or explain its specific technical highlights?`;
  }

  return "I've processed your question! I highly recommend checking out our curated category page filters or typing your direct requirements in the natural language bar above to let our Buying Engine compute the exact AI match scores for your specific use-cases.";
}

startServer();
