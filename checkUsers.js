const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log(' Connected to MongoDB\n');
  
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  
  console.log(`Total users: ${users.length}\n`);
  
  users.forEach((user, i) => {
    console.log(`${i+1}. ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}\n`);
  });
  
  process.exit(0);
});
