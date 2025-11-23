const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Opportunity = require('./models/Opportunity');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkOpportunities = async () => {
  await connectDB();
  
  console.log('\n=== CHECKING OPPORTUNITIES ===');
  
  try {
    // Use direct MongoDB query to bypass any model issues
    const db = mongoose.connection.db;
    const collection = db.collection('opportunities');
    
    const opportunities = await collection.find({}).toArray();
    console.log('Total opportunities in DB:', opportunities.length);
    
    if (opportunities.length > 0) {
      console.log('\nOpportunities:');
      opportunities.forEach((opp, index) => {
        console.log(`\n${index + 1}. ${opp.title}`);
        console.log(`   Company: ${opp.company}`);
        console.log(`   Status: ${opp.status}`);
        console.log(`   Organizer: ${opp.organizerName}`);
        console.log(`   Stipend: ${opp.stipend}`);
        console.log(`   Location: ${opp.location}`);
        console.log(`   Created: ${opp.createdAt}`);
      });
    } else {
      console.log('\n⚠️ NO OPPORTUNITIES FOUND IN DATABASE!');
      console.log('You need to create internships first.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
};

checkOpportunities();
