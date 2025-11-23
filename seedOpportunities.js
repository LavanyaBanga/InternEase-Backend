const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

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

const seedOpportunities = async () => {
  await connectDB();
  
  console.log('\n=== CLEANING OLD OPPORTUNITIES ===');
  await Opportunity.deleteMany({});
  console.log('✅ Deleted all old opportunities');
  
  console.log('\n=== FINDING ORGANIZER ===');
  const organizer = await User.findOne({ role: 'organizer' });
  
  if (!organizer) {
    console.error('❌ No organizer found! Please create an organizer account first.');
    process.exit(1);
  }
  
  console.log('✅ Found organizer:', organizer.name, organizer.email);
  
  console.log('\n=== CREATING TEST OPPORTUNITIES ===');
  
  const opportunities = [
    {
      title: 'Full Stack Developer Intern',
      company: 'TechCorp Solutions',
      description: 'Join our dynamic team to build cutting-edge web applications using React and Node.js. You will work on real projects and learn from experienced developers.',
      type: 'internship',
      duration: '6 months',
      stipend: '₹25,000/month',
      location: 'Bangalore, India',
      workMode: 'Hybrid',
      lastDate: '2025-12-31',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Git'],
      requirements: ['Bachelor\'s degree in Computer Science', 'Strong problem-solving skills', 'Good communication'],
      responsibilities: ['Develop web applications', 'Write clean code', 'Collaborate with team', 'Participate in code reviews'],
      organizer: organizer._id,
      organizerName: organizer.name,
      status: 'Active',
    },
    {
      title: 'Frontend Developer Intern',
      company: 'Digital Innovations Pvt Ltd',
      description: 'Work on modern web interfaces using React, TailwindCSS, and TypeScript. Perfect opportunity for students passionate about UI/UX.',
      type: 'internship',
      duration: '3 months',
      stipend: '₹15,000/month',
      location: 'Mumbai, India',
      workMode: 'Remote',
      lastDate: '2025-11-30',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TailwindCSS'],
      requirements: ['Knowledge of modern JavaScript', 'Understanding of React', 'Portfolio of projects'],
      responsibilities: ['Build UI components', 'Implement responsive designs', 'Optimize performance', 'Fix bugs'],
      organizer: organizer._id,
      organizerName: organizer.name,
      status: 'Active',
    },
    {
      title: 'Backend Developer Intern',
      company: 'CloudTech Systems',
      description: 'Learn server-side development with Node.js, Express, and databases. Work on scalable backend systems and APIs.',
      type: 'internship',
      duration: '4 months',
      stipend: '₹20,000/month',
      location: 'Hyderabad, India',
      workMode: 'On-site',
      lastDate: '2025-12-15',
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs'],
      requirements: ['Understanding of databases', 'Basic knowledge of Node.js', 'Problem-solving skills'],
      responsibilities: ['Develop REST APIs', 'Database design', 'Write unit tests', 'Deploy applications'],
      organizer: organizer._id,
      organizerName: organizer.name,
      status: 'Active',
    }
  ];
  
  for (const oppData of opportunities) {
    const opportunity = await Opportunity.create(oppData);
    console.log(`✅ Created: ${opportunity.title} at ${opportunity.company}`);
  }
  
  console.log('\n=== VERIFICATION ===');
  const count = await Opportunity.countDocuments();
  console.log(`Total opportunities in DB: ${count}`);
  
  const allOpps = await Opportunity.find();
  allOpps.forEach((opp, index) => {
    console.log(`\n${index + 1}. ${opp.title}`);
    console.log(`   Company: ${opp.company}`);
    console.log(`   Status: ${opp.status}`);
    console.log(`   Location: ${opp.location}`);
    console.log(`   Stipend: ${opp.stipend}`);
  });
  
  console.log('\n✅ SEEDING COMPLETE!');
  process.exit(0);
};

seedOpportunities().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
