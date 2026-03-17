import mongoose from "mongoose";


const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDb connected successfully");
        console.log(`🗄️ database name: ${conn.connection.name}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED:", error.message);
        process.exit(1);
    }
}

export default connectDB;
