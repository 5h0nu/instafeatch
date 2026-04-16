const express = require('express');
const Insta = require('scraper-instagram');
const app = express();
const port = process.env.PORT || 3000;

// Initialize Instagram Client
const InstaClient = new Insta();

// AUTHENTICATION: Use your Session ID
// You can set this in Railway Environment Variables as SESSION_ID
const sessionId = process.env.SESSION_ID; 
if (sessionId) {
    InstaClient.authBySessionId(sessionId)
        .then(() => console.log("✅ Authenticated with Session ID"))
        .catch(err => console.error("❌ Auth Failed:", err));
}

app.get('/fetch', async (req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ error: "Missing username" });

    try {
        const profile = await InstaClient.getProfile(username);
        res.json({
            success: true,
            data: {
                username: profile.username,
                name: profile.name,
                bio: profile.bio,
                followers: profile.followers,
                following: profile.following,
                posts: profile.posts,
                dp: profile.pic,
                link: profile.website
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
