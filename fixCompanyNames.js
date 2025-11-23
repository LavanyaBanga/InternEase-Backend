// Script to fix company names in opportunities
require('dotenv').config();
const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixCompanyNames = async () => {
  await connectDB();

  console.log('\n=== CHECKING OPPORTUNITIES ===\n');

  // Get all opportunities
  const opportunities = await Opportunity.find().populate('organizer', 'name');

  console.log(`Found ${opportunities.length} opportunities\n`);

  let fixedCount = 0;

  for (const opp of opportunities) {
    console.log(`\nChecking: ${opp.title}`);
    console.log(`Current company: "${opp.company}"`);
    console.log(`Organizer name: "${opp.organizer?.name}"`);

    // Check if company name is same as organizer name (likely a mistake)
    if (opp.company === opp.organizer?.name) {
      console.log('⚠️  Company name matches organizer name - this needs to be fixed manually');
      console.log('   Please provide a proper company name for this internship');
      console.log(`   ID: ${opp._id}`);
    } else if (!opp.company || opp.company.trim() === '') {
      console.log('⚠️  Company name is empty');
      console.log(`   ID: ${opp._id}`);
    } else {
      console.log('✅ Company name looks good');
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total opportunities: ${opportunities.length}`);
  console.log(`\nTo fix a specific opportunity, you can use:`);
  console.log(`db.opportunities.updateOne({_id: ObjectId("ID_HERE")}, {$set: {company: "Proper Company Name"}})`);

  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
};

fixCompanyNames().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
