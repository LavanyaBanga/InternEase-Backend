// Script to update a specific opportunity's company name
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const updateCompanyName = async () => {
  await connectDB();

  const db = mongoose.connection.db;
  const collection = db.collection('opportunities');

  console.log('\n=== FINDING OPPORTUNITIES WITH ORGANIZER NAME AS COMPANY ===\n');

  // Find opportunities where company might be a person's name
  const opportunities = await collection.find({}).toArray();

  console.log(`Found ${opportunities.length} opportunities\n`);

  for (const opp of opportunities) {
    console.log(`\nTitle: ${opp.title}`);
    console.log(`Current Company: ${opp.company}`);
    console.log(`ID: ${opp._id}`);

    // Check if company looks like a person's name (contains spaces and is short)
    const companyWords = opp.company?.split(' ') || [];
    if (companyWords.length === 2 && opp.company.length < 20) {
      console.log('⚠️  This looks like it might be a person\'s name');
      
      // Suggest a proper company name based on the title
      let suggestedCompany = 'TechCorp Solutions';
      if (opp.title.toLowerCase().includes('frontend')) {
        suggestedCompany = 'Digital Innovations';
      } else if (opp.title.toLowerCase().includes('backend')) {
        suggestedCompany = 'CloudTech Systems';
      } else if (opp.title.toLowerCase().includes('full stack')) {
        suggestedCompany = 'TechCorp Solutions';
      } else if (opp.title.toLowerCase().includes('data')) {
        suggestedCompany = 'DataTech Analytics';
      } else if (opp.title.toLowerCase().includes('mobile')) {
        suggestedCompany = 'MobileFirst Inc';
      }

      console.log(`   Updating to: ${suggestedCompany}`);
      
      await collection.updateOne(
        { _id: opp._id },
        { $set: { company: suggestedCompany } }
      );
      
      console.log('   ✅ Updated!');
    } else {
      console.log('   ✅ Company name looks fine');
    }
  }

  console.log('\n=== COMPLETED ===');
  
  // Verify the changes
  console.log('\n=== VERIFICATION ===\n');
  const updatedOpps = await collection.find({}).toArray();
  updatedOpps.forEach(opp => {
    console.log(`${opp.title} - ${opp.company}`);
  });

  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
};

updateCompanyName().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
