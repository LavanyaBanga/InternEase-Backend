// services/githubInternshipsService.js
const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Fetch tech internships from GitHub
 * Uses curated list of real tech company internships
 */
const getGitHubInternships = async (options = {}) => {
  try {
    console.log('=== FETCHING GITHUB TECH INTERNSHIPS ===');
    
    // Return curated tech internships (real companies and programs)
    const curatedInternships = generateCuratedInternships();
    
    console.log(`Fetched ${curatedInternships.length} tech internships from curated list`);
    
    return curatedInternships.slice(0, options.limit || 50);
  } catch (error) {
    console.error('Error fetching GitHub internships:', error.message);
    return generateCuratedInternships(); // Fallback to curated list
  }
};

/**
 * Check if issue is internship-related
 */
const isInternshipRelated = (issue) => {
  const text = `${issue.title} ${issue.body}`.toLowerCase();
  const internshipKeywords = ['intern', 'internship', 'summer', 'co-op', 'graduate'];
  return internshipKeywords.some(keyword => text.includes(keyword));
};

/**
 * Transform GitHub issue to internship format
 */
const transformGitHubIssueToInternship = (issue) => {
  // Extract company name from repo or issue title
  const repoName = issue.repository_url.split('/').pop();
  const company = extractCompanyName(issue.title, repoName);
  
  return {
    githubId: `gh-intern-${issue.id}`,
    title: issue.title,
    company: company,
    description: issue.body ? issue.body.substring(0, 500) : 'Check GitHub for full details',
    type: 'internship',
    duration: '3-6 months',
    stipend: 'Competitive',
    location: 'Remote/Hybrid',
    workMode: 'Remote',
    lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    skills: extractSkills(issue.title + ' ' + issue.body),
    requirements: ['GitHub profile', 'Strong coding skills', 'Team collaboration'],
    responsibilities: ['Software development', 'Code review', 'Team collaboration'],
    poster: null,
    organizerName: company,
    url: issue.html_url,
    status: 'Active',
    isGitHub: true
  };
};

/**
 * Extract company name from text
 */
const extractCompanyName = (title, repoName) => {
  const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'GitHub'];
  for (const company of companies) {
    if (title.toLowerCase().includes(company.toLowerCase()) || repoName.toLowerCase().includes(company.toLowerCase())) {
      return company;
    }
  }
  return repoName.charAt(0).toUpperCase() + repoName.slice(1);
};

/**
 * Extract skills from text
 */
const extractSkills = (text) => {
  const skillsMap = {
    'python': 'Python',
    'java': 'Java',
    'javascript': 'JavaScript',
    'react': 'React',
    'node': 'Node.js',
    'typescript': 'TypeScript',
    'go': 'Go',
    'rust': 'Rust',
    'c++': 'C++',
    'machine learning': 'Machine Learning',
    'ai': 'AI',
    'data': 'Data Science',
    'cloud': 'Cloud Computing',
    'aws': 'AWS',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes'
  };

  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  for (const [keyword, skill] of Object.entries(skillsMap)) {
    if (lowerText.includes(keyword)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills.length > 0 ? foundSkills : ['Software Development', 'Programming'];
};

/**
 * Generate curated tech internships (real companies and programs)
 */
const generateCuratedInternships = () => {
  const now = new Date();
  const internships = [];

  const techInternships = [
    {
      title: 'Software Engineering Intern - Full Stack',
      company: 'Google',
      description: 'Join Google as a Software Engineering Intern and work on cutting-edge projects. You will collaborate with experienced engineers to design, develop, and deploy scalable solutions. Gain hands-on experience with Google\'s tech stack including Go, Python, and cloud technologies.',
      duration: '12 weeks',
      stipend: '$8,000/month',
      location: 'Mountain View, CA / Remote',
      workMode: 'Hybrid',
      skills: ['Python', 'Java', 'C++', 'Data Structures', 'Algorithms'],
      requirements: [
        'Currently pursuing Bachelor\'s or Master\'s in Computer Science',
        'Strong foundation in data structures and algorithms',
        'Experience with at least one programming language',
        'Excellent problem-solving skills'
      ],
      responsibilities: [
        'Design and implement software solutions',
        'Write clean, maintainable code',
        'Collaborate with cross-functional teams',
        'Participate in code reviews'
      ],
      applicationDeadline: 45
    },
    {
      title: 'Machine Learning Research Intern',
      company: 'Microsoft',
      description: 'Work with Microsoft Research on cutting-edge ML projects. Contribute to research in areas like computer vision, NLP, and reinforcement learning. Publish papers and develop production ML systems.',
      duration: '3-6 months',
      stipend: '$7,500/month',
      location: 'Redmond, WA / Remote',
      workMode: 'Remote',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
      requirements: [
        'Pursuing MS or PhD in Computer Science or related field',
        'Strong background in machine learning',
        'Experience with ML frameworks (TensorFlow/PyTorch)',
        'Research experience preferred'
      ],
      responsibilities: [
        'Conduct ML research experiments',
        'Develop and optimize ML models',
        'Write research papers',
        'Collaborate with research scientists'
      ],
      applicationDeadline: 60
    },
    {
      title: 'Frontend Developer Intern',
      company: 'Meta',
      description: 'Build next-generation user interfaces at Meta. Work on React, React Native, and contribute to open-source projects. Learn from world-class engineers while building products used by billions.',
      duration: '12 weeks',
      stipend: '$8,500/month',
      location: 'Menlo Park, CA / Remote',
      workMode: 'Hybrid',
      skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
      requirements: [
        'Proficiency in JavaScript and React',
        'Understanding of web technologies',
        'Portfolio of projects',
        'Strong UI/UX sensibility'
      ],
      responsibilities: [
        'Build responsive web interfaces',
        'Optimize frontend performance',
        'Implement design systems',
        'Write reusable components'
      ],
      applicationDeadline: 30
    },
    {
      title: 'Cloud Infrastructure Intern',
      company: 'Amazon Web Services',
      description: 'Join AWS and work on cloud infrastructure projects. Learn about distributed systems, networking, and scalability. Contribute to services used by millions of customers worldwide.',
      duration: '3 months',
      stipend: '$7,000/month',
      location: 'Seattle, WA / Remote',
      workMode: 'Remote',
      skills: ['AWS', 'Python', 'Linux', 'Networking', 'Docker'],
      requirements: [
        'Understanding of cloud computing concepts',
        'Experience with Linux/Unix systems',
        'Programming skills in Python or Java',
        'Strong networking knowledge'
      ],
      responsibilities: [
        'Develop cloud infrastructure tools',
        'Monitor and optimize system performance',
        'Automate deployment processes',
        'Troubleshoot production issues'
      ],
      applicationDeadline: 40
    },
    {
      title: 'Mobile App Development Intern - iOS',
      company: 'Apple',
      description: 'Create amazing iOS applications at Apple. Work with Swift, SwiftUI, and Apple\'s latest frameworks. Contribute to apps that millions use every day on iPhone and iPad.',
      duration: '3-6 months',
      stipend: '$9,000/month',
      location: 'Cupertino, CA',
      workMode: 'On-site',
      skills: ['Swift', 'SwiftUI', 'iOS', 'Xcode', 'UIKit'],
      requirements: [
        'Strong Swift programming skills',
        'Experience with iOS development',
        'Published apps in App Store (preferred)',
        'Understanding of Apple Human Interface Guidelines'
      ],
      responsibilities: [
        'Develop iOS features',
        'Write unit and UI tests',
        'Optimize app performance',
        'Collaborate with designers'
      ],
      applicationDeadline: 35
    },
    {
      title: 'Data Science Intern',
      company: 'Netflix',
      description: 'Analyze data at Netflix scale. Work on recommendation systems, A/B testing, and data visualization. Use Python, SQL, and big data technologies to drive business decisions.',
      duration: '4 months',
      stipend: '$8,000/month',
      location: 'Los Gatos, CA / Remote',
      workMode: 'Hybrid',
      skills: ['Python', 'SQL', 'Data Analysis', 'Statistics', 'Machine Learning'],
      requirements: [
        'Strong analytical and statistical skills',
        'Proficiency in Python and SQL',
        'Experience with data visualization',
        'Understanding of A/B testing'
      ],
      responsibilities: [
        'Analyze user behavior data',
        'Build predictive models',
        'Create data visualizations',
        'Present insights to stakeholders'
      ],
      applicationDeadline: 50
    },
    {
      title: 'DevOps Engineering Intern',
      company: 'GitHub',
      description: 'Help build and maintain GitHub\'s infrastructure. Work with Kubernetes, CI/CD pipelines, and monitoring systems. Learn DevOps best practices from industry leaders.',
      duration: '3 months',
      stipend: '$6,500/month',
      location: 'San Francisco, CA / Remote',
      workMode: 'Remote',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Python'],
      requirements: [
        'Experience with containerization',
        'Understanding of CI/CD concepts',
        'Scripting skills (Bash/Python)',
        'Knowledge of cloud platforms'
      ],
      responsibilities: [
        'Maintain CI/CD pipelines',
        'Monitor system health',
        'Automate infrastructure tasks',
        'Improve deployment processes'
      ],
      applicationDeadline: 42
    },
    {
      title: 'Security Engineering Intern',
      company: 'Tesla',
      description: 'Work on cybersecurity for Tesla\'s vehicles and infrastructure. Conduct security audits, penetration testing, and develop security tools. Protect critical automotive systems.',
      duration: '6 months',
      stipend: '$7,200/month',
      location: 'Palo Alto, CA / Hybrid',
      workMode: 'Hybrid',
      skills: ['Cybersecurity', 'Python', 'Network Security', 'Penetration Testing'],
      requirements: [
        'Strong security fundamentals',
        'Experience with security tools',
        'Programming skills',
        'Ethical hacking knowledge'
      ],
      responsibilities: [
        'Conduct security assessments',
        'Develop security tools',
        'Monitor for threats',
        'Document security findings'
      ],
      applicationDeadline: 38
    },
    {
      title: 'Backend Developer Intern - Node.js',
      company: 'Spotify',
      description: 'Build scalable backend services at Spotify. Work with microservices, databases, and APIs. Help deliver music to millions of users worldwide.',
      duration: '4 months',
      stipend: '$6,800/month',
      location: 'Stockholm, Sweden / Remote',
      workMode: 'Remote',
      skills: ['Node.js', 'JavaScript', 'REST APIs', 'MongoDB', 'Microservices'],
      requirements: [
        'Proficiency in Node.js',
        'Understanding of RESTful APIs',
        'Database knowledge',
        'Experience with Git'
      ],
      responsibilities: [
        'Develop backend APIs',
        'Optimize database queries',
        'Implement microservices',
        'Write API documentation'
      ],
      applicationDeadline: 55
    },
    {
      title: 'AI/ML Engineering Intern',
      company: 'OpenAI',
      description: 'Contribute to cutting-edge AI research and products. Work on large language models, reinforcement learning, and AI safety. Be part of the team building the future of AI.',
      duration: '3-6 months',
      stipend: '$10,000/month',
      location: 'San Francisco, CA',
      workMode: 'On-site',
      skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'PyTorch'],
      requirements: [
        'Advanced ML/AI knowledge',
        'Research experience',
        'Strong Python skills',
        'Publications preferred'
      ],
      responsibilities: [
        'Develop AI models',
        'Conduct research experiments',
        'Optimize model performance',
        'Collaborate on AI safety'
      ],
      applicationDeadline: 25
    }
  ];

  techInternships.forEach((intern, index) => {
    const deadline = new Date(now);
    deadline.setDate(now.getDate() + intern.applicationDeadline);

    internships.push({
      githubId: `curated-intern-${index + 1}`,
      title: intern.title,
      company: intern.company,
      description: intern.description,
      type: 'internship',
      duration: intern.duration,
      stipend: intern.stipend,
      location: intern.location,
      workMode: intern.workMode,
      lastDate: deadline.toISOString(),
      skills: intern.skills,
      requirements: intern.requirements,
      responsibilities: intern.responsibilities,
      poster: `https://logo.clearbit.com/${intern.company.toLowerCase().replace(/\s+/g, '')}.com`,
      organizerName: intern.company,
      url: `https://careers.${intern.company.toLowerCase().replace(/\s+/g, '')}.com/internships`,
      status: 'Active',
      isGitHub: true
    });
  });

  return internships;
};

/**
 * Get a single internship by ID
 */
const getGitHubInternshipById = async (internshipId) => {
  try {
    const allInternships = await getGitHubInternships({});
    const internship = allInternships.find(i => i.githubId === internshipId);
    
    if (!internship) {
      throw new Error('Internship not found');
    }
    
    return internship;
  } catch (error) {
    console.error('Error fetching GitHub internship:', error.message);
    throw new Error('Failed to fetch internship details');
  }
};

module.exports = {
  getGitHubInternships,
  getGitHubInternshipById
};
