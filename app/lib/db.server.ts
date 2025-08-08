import mongoose from "mongoose";

// GIẢI PHÁP 1: Kiểm tra trước khi connect (Recommended)
export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        console.log('⚠️ MongoDB already connected');
        return;
    }

    const MONGODB_URI = process.env.MONGO_URI;

    if (!MONGODB_URI) {
        console.error('❌ MONGO_URI environment variable is not defined');
        throw new Error('Database configuration error: MONGO_URI is required');
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}