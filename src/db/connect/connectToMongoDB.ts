const mongoose = require('mongoose');

export const DB = async () => {
    try {

        const connet = await mongoose.connect('mongodb://127.0.0.1:27017/emp');
        console.log(`mongoDB connting${connet.connection.host}`);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1)

    }
}

