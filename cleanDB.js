const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const cleanDB = async () => {
  await connectDB();
  
  const db = mongoose.connection.db;
  const collection = db.collection('opportunities');
  
  console.log('\n=== DELETING CORRUPTED RECORDS ===');
  
  
  const result = await collection.deleteMany({ 
    $or: [
      { company: { $exists: false } },
      { company: null },
      { company: undefined }
    ]
  });
  
  console.log(` Deleted ${result.deletedCount} corrupted records`);
  
  const remaining = await collection.countDocuments();
  console.log(`Remaining records: ${remaining}`);
  
  if (remaining > 0) {
    console.log('\nRemaining opportunities:');
    const opps = await collection.find({}).toArray();
    opps.forEach((opp, i) => {
      console.log(`${i+1}. ${opp.title} - ${opp.company}`);
    });
  }
  
  process.exit(0);
};

cleanDB();
