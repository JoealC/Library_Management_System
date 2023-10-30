import mongoose from 'mongoose';

const dbUrl = 'mongodb://localhost:27017/LibManagement';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB!!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};