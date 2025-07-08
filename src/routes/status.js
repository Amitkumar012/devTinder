
const express = require("express");
const router = express.Router();
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");

router.get("/status/:userId", userAuth, async (req, res) => {
    try{

        const user = await User.findById(req.params.userId).select("isOnline lastSeen");

        if (!user) return res.status(404).json({error: "User not found"});

        res.json({
            userId: user._id,
            isOnline:user.isOnline,
            lastSeen: user.lastSeen,
        });

    }
    catch (error) {
        console.error("Status fetch error:", error);
        res.status(500).json({error: "Internal server error"});
    }

});

module.exports = router;
