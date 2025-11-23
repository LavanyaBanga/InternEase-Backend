// Test script to check applications in database
require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const Opportunity = require('./models/Opportunity');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkApplications = async () => {
  await connectDB();

  console.log('\n=== CHECKING APPLICATIONS ===\n');

  // Get all applications with populated data
  const applications = await Application.find()
    .populate('user', 'name email role')
    .populate('opportunity', 'title company type')
    .sort('-createdAt');

  console.log(`Found ${applications.length} applications\n`);

  applications.forEach((app, index) => {
    console.log(`\n--- Application ${index + 1} ---`);
    console.log('Application ID:', app._id);
    console.log('Created At:', app.createdAt);
    console.log('\nUser Info:');
    console.log('  - Name:', app.user?.name);
    console.log('  - Email:', app.user?.email);
    console.log('  - Role:', app.user?.role);
    console.log('\nOpportunity Info:');
    console.log('  - Title:', app.opportunity?.title);
    console.log('  - Company:', app.opportunity?.company);
    console.log('  - Type:', app.opportunity?.type);
    console.log('\nSnapshot Info (saved at application time):');
    if (app.opportunitySnapshot) {
      console.log('  - Title:', app.opportunitySnapshot.title);
      console.log('  - Company:', app.opportunitySnapshot.company);
      console.log('  - Location:', app.opportunitySnapshot.location);
      console.log('  - Type:', app.opportunitySnapshot.type);
      console.log('  - Stipend:', app.opportunitySnapshot.stipend);
      console.log('  - Duration:', app.opportunitySnapshot.duration);
      console.log('  - Skills:', app.opportunitySnapshot.skills?.join(', '));
      console.log('  - Requirements:', app.opportunitySnapshot.requirements?.length, 'items');
    } else {
      console.log('  - No snapshot data (old application)');
    }
    console.log('\nApplication Status:', app.status);
    console.log('Cover Letter:', app.coverLetter ? 'Yes' : 'No');
    console.log('Resume:', app.resume ? 'Yes' : 'No');
    console.log('Notes:', app.notes ? 'Yes' : 'No');
  });

  console.log('\n=== SUMMARY ===');
  const byStatus = {};
  applications.forEach(app => {
    byStatus[app.status] = (byStatus[app.status] || 0) + 1;
  });
  console.log('Applications by status:', byStatus);

  await mongoose.connection.close();
  console.log('\nDatabase connection closed');
};

checkApplications().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
