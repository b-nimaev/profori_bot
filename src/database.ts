import mongoose from 'mongoose';

const MONGODB_URI: string = `${process.env.MONGODB_URI}` || 'mongodb://localhost:27017/rlhub';

mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

module.exports = mongoose.connection;
