const mongoose = require('mongoose');

module.exports = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Mongodb Connected : ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}