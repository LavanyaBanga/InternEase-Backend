const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const testDirectInsert = async () => {
  await connectDB();
  
  const db = mongoose.connection.db;
  const collection = db.collection('opportunities');
  
  console.log('\n=== TESTING DIRECT INSERT ===');
  
  const testDoc = {
    title: 'Test Internship',
    company: 'Test Company',
    description: 'Test Description',
    type: 'internship',
    duration: '3 months',
    stipend: '₹15,000/month',
    location: 'Test Location',
    workMode: 'Remote',
    lastDate: '2025-12-31',
    skills: ['React', 'Node.js'],
    requirements: ['Test req'],
    responsibilities: ['Test resp'],
    organizer: new mongoose.Types.ObjectId(),
    organizerName: 'Test Organizer',
    status: 'Active',
    views: 0,
    applicants: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  console.log('Inserting document:', testDoc);
  
  const result = await collection.insertOne(testDoc);
  console.log('Insert result:', result);
  
  const inserted = await collection.findOne({ _id: result.insertedId });
  console.log('\nRetrieved document:');
  console.log('Title:', inserted.title);
  console.log('Company:', inserted.company);
  console.log('Status:', inserted.status);
  console.log('Stipend:', inserted.stipend);
  
  console.log('\nFull document:', JSON.stringify(inserted, null, 2));
  
  process.exit(0);
};

testDirectInsert().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
