const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elearning', {
      // Las opciones deprecadas han sido removidas desde Mongoose 6, pero lo mantenemos simple.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión Mongoose: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
