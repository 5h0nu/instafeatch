const express = require('express');
const Insta = require('scraper-instagram');
const app = express();
const port = process.env.PORT || 3000;

// Initialize Client
const InstaClient = new Insta();

// Configuration from Environment Variables
const sessionId = process.env.SESSION_ID;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// 1. Authentication Logic
if (sessionId) {
    InstaClient.authBySessionId(sessionId, userAgent)
        .then(() => {
            console.log("✅ Authenticated successfully with Instagram!");
        })
        .catch(err => {
            console.error("❌ Auth Failed (302/Invalid Session):", err.message);
        });
} else {
    console.warn("⚠️ No SESSION_ID found in Environment Variables.");
}

// 2. The API Endpoint
app.get('/info', async (req, res) => {
    const target = req.query.username;

    if (!target) {
        return res.status(400).json({ error: "Please provide a username parameter." });
    }

    try {
        console.log(`🔎 Fetching data for: ${target}`);
        const profile = await InstaClient.getProfile(target);

        res.json({
            status: "success",
            username: profile.username,
            name: profile.name,
            bio: profile.bio,
            followers: profile.followers,
            following: profile.following,
            posts_count: profile.posts,
            profile_pic: profile.pic,
            external_link: profile.website || "No link",
            is_private: profile.private,
            is_verified: profile.verified
        });
    } catch (error) {
        console.error("❌ Scrape Error:", error.message);
        res.status(500).json({ 
            status: "error", 
            message: "Could not fetch profile. It might be private or blocked.",
            details: error.message 
        });
    }
});

// 3. Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
