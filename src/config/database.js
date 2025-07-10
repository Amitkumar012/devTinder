
const mongoose =require("mongoose" );

const connectDB = async () => {
    await mongoose.connect(
        process.env.DB_CONNECTION_SECRET
    );
    console.log("✅ Connected to MongoDB:", mongoose.connection.name);
    console.log("📂 DB host:", mongoose.connection.host);
};

module.exports=connectDB;
