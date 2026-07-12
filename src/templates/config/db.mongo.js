import mongoose from 'mongoose';

export async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myapp');
    console.log('\x1b[32m[Database] MongoDB connected successfully! 🍃\x1b[0m');
}
