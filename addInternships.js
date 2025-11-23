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

const addProperInternships = async () => {
  await connectDB();
  
  const db = mongoose.connection.db;
  const collection = db.collection('opportunities');
  const usersCollection = db.collection('users');
  
  
  const organizer = await usersCollection.findOne({ role: 'organizer' });
  
  if (!organizer) {
    console.error(' No organizer found!');
    process.exit(1);
  }
  
  console.log(' Found organizer:', organizer.name);
  
  const internships = [
    {
      title: 'Full Stack Developer Intern',
      company: 'TechCorp Solutions',
      description: 'Join our team to build cutting-edge web applications using React and Node.js.',
      type: 'internship',
      duration: '6 months',
      stipend: '₹25,000/month',
      location: 'Bangalore, India',
      workMode: 'Hybrid',
      lastDate: '2025-12-31',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Git'],
      requirements: ['Bachelor degree in CS', 'Strong problem-solving'],
      responsibilities: ['Develop web apps', 'Write clean code'],
      organizer: organizer._id,
      organizerName: organizer.name,
      status: 'Active',
      views: 0,
      applicants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Frontend Developer Intern',
      company: 'Digital Innovations',
      description: 'Work on modern web interfaces using React and TailwindCSS.',
      type: 'internship',
      duration: '3 months',
      stipend: '₹15,000/month',
      location: 'Mumbai, India',
      workMode: 'Remote',
      lastDate: '2025-11-30',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TailwindCSS'],
      requirements: ['Knowledge of React', 'Portfolio of projects'],
      responsibilities: ['Build UI components', 'Implement designs'],
      organizer: organizer._id,
      organizerName: organizer.name,
      status: 'Active',
      views: 0,
      applicants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Backend Developer Intern',
      company: 'CloudTech Systems',
      description: 'Learn server-side development with Node.js and databases.',
      type: 'internship',
      duration: '4 months',
      stipend: '₹20,000/month',
      location: 'Hyderabad, India',
      workMode: 'On-site',
      lastDate: '2025-12-15',
      skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
      requirements: ['Understanding of databases', 'Node.js basics'],
      responsibilities: ['Develop APIs', 'Database design'],
      organizer: organizer._id,
      organizerName: organizer.name,
      status: 'Active',
      views: 0,
      applicants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  console.log('\n=== ADDING INTERNSHIPS ===');
  for (const intern of internships) {
    await collection.insertOne(intern);
    console.log(` Added: ${intern.title} at ${intern.company}`);
  }
  
  const total = await collection.countDocuments();
  console.log(`\n Total internships in DB: ${total}`);
  
  console.log('\n=== ALL INTERNSHIPS ===');
  const all = await collection.find({}).toArray();
  all.forEach((opp, i) => {
    console.log(`${i+1}. ${opp.title} - ${opp.company} (${opp.status})`);
  });
  
  process.exit(0);
};

addProperInternships().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
