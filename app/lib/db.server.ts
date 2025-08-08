import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI || "mongodb+srv://admin:231001@cluster0.j1dook0.mongodb.net/shopclapages?retryWrites=true&w=majority&appName=Cluster0";

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        console.log('⚠️ MongoDB already connected');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
    }
}

