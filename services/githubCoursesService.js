// services/githubCoursesService.js
const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Fetch tech courses from GitHub Education and curated resources
 */
const getGitHubCourses = async (options = {}) => {
  try {
    console.log('=== FETCHING GITHUB EDUCATION COURSES ===');
    
    // Return curated tech courses from top platforms and universities
    const curatedCourses = generateCuratedCourses();
    
    console.log(`Fetched ${curatedCourses.length} tech courses from curated list`);
    
    return curatedCourses.slice(0, options.limit || 50);
  } catch (error) {
    console.error('Error fetching GitHub courses:', error.message);
    return generateCuratedCourses(); // Fallback to curated list
  }
};

/**
 * Generate curated tech courses from top platforms
 */
const generateCuratedCourses = () => {
  const now = new Date();
  const courses = [];

  const techCourses = [
    {
      title: 'CS50: Introduction to Computer Science',
      instructor: 'David J. Malan',
      platform: 'Harvard University',
      description: 'Harvard University\'s introduction to computer science and programming. Learn problem-solving, algorithms, data structures, web development, and more. One of the most popular programming courses worldwide.',
      duration: '12 weeks',
      level: 'Beginner',
      price: 'Free',
      topics: ['Python', 'C', 'SQL', 'JavaScript', 'HTML', 'CSS', 'Algorithms'],
      modules: 11,
      enrolled: 4500000,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=800&q=80',
      certificate: true,
      url: 'https://cs50.harvard.edu/'
    },
    {
      title: 'Full Stack Open',
      instructor: 'University of Helsinki',
      platform: 'University of Helsinki',
      description: 'Deep dive into modern web development with React, Redux, Node.js, MongoDB, GraphQL and TypeScript. Build single page applications with ReactJS that use REST APIs built with Node.js.',
      duration: '8-10 weeks',
      level: 'Intermediate',
      price: 'Free',
      topics: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript', 'REST API'],
      modules: 13,
      enrolled: 250000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      certificate: true,
      url: 'https://fullstackopen.com/'
    },
    {
      title: 'Machine Learning Specialization',
      instructor: 'Andrew Ng',
      platform: 'Stanford University',
      description: 'Learn the fundamentals of machine learning from AI pioneer Andrew Ng. Master supervised learning, neural networks, decision trees, and best practices for ML development.',
      duration: '3 months',
      level: 'Beginner',
      price: 'Free',
      topics: ['Machine Learning', 'Python', 'TensorFlow', 'Neural Networks', 'Deep Learning'],
      modules: 17,
      enrolled: 8500000,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
      certificate: true,
      url: 'https://www.coursera.org/specializations/machine-learning-introduction'
    },
    {
      title: 'The Odin Project',
      instructor: 'The Odin Project Team',
      platform: 'The Odin Project',
      description: 'Free full stack curriculum for learning web development. Hands-on projects, community support, and a complete path from beginner to getting hired as a developer.',
      duration: '6-12 months',
      level: 'Beginner',
      price: 'Free',
      topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Ruby on Rails'],
      modules: 25,
      enrolled: 180000,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      certificate: false,
      url: 'https://www.theodinproject.com/'
    },
    {
      title: 'MIT OpenCourseWare: Introduction to Algorithms',
      instructor: 'Erik Demaine',
      platform: 'MIT',
      description: 'Learn fundamental algorithms including sorting, searching, graph algorithms, and dynamic programming. Course materials from MIT\'s legendary algorithms course.',
      duration: '16 weeks',
      level: 'Advanced',
      price: 'Free',
      topics: ['Algorithms', 'Data Structures', 'Python', 'Graph Theory', 'Dynamic Programming'],
      modules: 24,
      enrolled: 320000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
      certificate: false,
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/'
    },
    {
      title: 'freeCodeCamp: Responsive Web Design',
      instructor: 'freeCodeCamp.org',
      platform: 'freeCodeCamp',
      description: 'Learn HTML, CSS, and responsive design by building 5 projects. Master CSS Grid, Flexbox, and modern web design principles. Get certified upon completion.',
      duration: '300 hours',
      level: 'Beginner',
      price: 'Free',
      topics: ['HTML', 'CSS', 'Responsive Design', 'Flexbox', 'CSS Grid'],
      modules: 5,
      enrolled: 1200000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
      certificate: true,
      url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'
    },
    {
      title: 'Deep Learning Specialization',
      instructor: 'Andrew Ng',
      platform: 'DeepLearning.AI',
      description: 'Master deep learning fundamentals, build neural networks, and lead ML projects. Learn CNNs, RNNs, LSTMs, and transformers from the pioneer of online education.',
      duration: '5 months',
      level: 'Intermediate',
      price: 'Free',
      topics: ['Deep Learning', 'Neural Networks', 'CNN', 'RNN', 'TensorFlow', 'Python'],
      modules: 20,
      enrolled: 650000,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      certificate: true,
      url: 'https://www.coursera.org/specializations/deep-learning'
    },
    {
      title: 'Python for Everybody',
      instructor: 'Dr. Charles Severance',
      platform: 'University of Michigan',
      description: 'Learn to program and analyze data with Python. Design and create applications for data retrieval, processing, and visualization. Perfect for beginners.',
      duration: '8 months',
      level: 'Beginner',
      price: 'Free',
      topics: ['Python', 'Data Analysis', 'SQL', 'Web Scraping', 'APIs'],
      modules: 15,
      enrolled: 2100000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
      certificate: true,
      url: 'https://www.py4e.com/'
    },
    {
      title: 'JavaScript Algorithms and Data Structures',
      instructor: 'freeCodeCamp.org',
      platform: 'freeCodeCamp',
      description: 'Learn JavaScript fundamentals including variables, arrays, objects, loops, and functions. Solve algorithmic challenges and build projects.',
      duration: '300 hours',
      level: 'Intermediate',
      price: 'Free',
      topics: ['JavaScript', 'Algorithms', 'Data Structures', 'ES6', 'Functional Programming'],
      modules: 9,
      enrolled: 980000,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
      certificate: true,
      url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/'
    },
    {
      title: 'AWS Cloud Practitioner Essentials',
      instructor: 'AWS Training',
      platform: 'Amazon Web Services',
      description: 'Learn AWS Cloud fundamentals including compute, storage, databases, networking, and security. Perfect preparation for AWS certification.',
      duration: '6 hours',
      level: 'Beginner',
      price: 'Free',
      topics: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'Networking', 'Security'],
      modules: 10,
      enrolled: 450000,
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      certificate: true,
      url: 'https://aws.amazon.com/training/digital/'
    },
    {
      title: 'React - The Complete Guide',
      instructor: 'Academind',
      platform: 'GitHub Education',
      description: 'Master React including Hooks, Redux, React Router, Next.js and more. Build modern, reactive user interfaces for web and mobile applications.',
      duration: '10 weeks',
      level: 'Intermediate',
      price: 'Free',
      topics: ['React', 'Hooks', 'Redux', 'Next.js', 'React Router', 'TypeScript'],
      modules: 28,
      enrolled: 520000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
      certificate: false,
      url: 'https://github.com/academind/react-complete-guide'
    },
    {
      title: 'Data Science and Machine Learning Bootcamp',
      instructor: 'Jose Portilla',
      platform: 'GitHub Education',
      description: 'Complete data science bootcamp covering Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-Learn, and Machine Learning algorithms.',
      duration: '12 weeks',
      level: 'Intermediate',
      price: 'Free',
      topics: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization', 'Scikit-Learn'],
      modules: 22,
      enrolled: 380000,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      certificate: false,
      url: 'https://github.com/topics/data-science-bootcamp'
    },
    {
      title: 'Cybersecurity Fundamentals',
      instructor: 'IBM',
      platform: 'IBM Skills Network',
      description: 'Learn cybersecurity basics including network security, cryptography, ethical hacking, and security best practices. Industry-recognized certification.',
      duration: '3 months',
      level: 'Beginner',
      price: 'Free',
      topics: ['Cybersecurity', 'Network Security', 'Cryptography', 'Ethical Hacking', 'Linux'],
      modules: 14,
      enrolled: 290000,
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      certificate: true,
      url: 'https://www.ibm.com/training/cybersecurity'
    },
    {
      title: 'Docker and Kubernetes',
      instructor: 'KodeKloud',
      platform: 'GitHub Education',
      description: 'Master containerization with Docker and orchestration with Kubernetes. Learn to deploy, scale, and manage containerized applications.',
      duration: '8 weeks',
      level: 'Intermediate',
      price: 'Free',
      topics: ['Docker', 'Kubernetes', 'DevOps', 'Containers', 'Microservices', 'CI/CD'],
      modules: 16,
      enrolled: 210000,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1605745341075-0f20e9a25753?w=800&q=80',
      certificate: false,
      url: 'https://github.com/kodekloudhub/certified-kubernetes-administrator-course'
    },
    {
      title: 'Mobile App Development with React Native',
      instructor: 'Meta',
      platform: 'Meta Open Source',
      description: 'Build native mobile applications for iOS and Android using React Native. Learn navigation, state management, and native modules.',
      duration: '10 weeks',
      level: 'Intermediate',
      price: 'Free',
      topics: ['React Native', 'Mobile Development', 'iOS', 'Android', 'JavaScript', 'Expo'],
      modules: 12,
      enrolled: 340000,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      certificate: false,
      url: 'https://reactnative.dev/docs/tutorial'
    }
  ];

  techCourses.forEach((course, index) => {
    courses.push({
      githubId: `curated-course-${index + 1}`,
      title: course.title,
      instructor: course.instructor,
      platform: course.platform,
      description: course.description,
      duration: course.duration,
      level: course.level,
      price: course.price,
      topics: course.topics,
      modules: course.modules,
      enrolled: course.enrolled,
      rating: course.rating,
      thumbnail: course.thumbnail,
      certificate: course.certificate,
      url: course.url,
      createdAt: now.toISOString(),
      isGitHub: true
    });
  });

  return courses;
};

/**
 * Get a single course by ID
 */
const getGitHubCourseById = async (courseId) => {
  try {
    const allCourses = await getGitHubCourses({});
    const course = allCourses.find(c => c.githubId === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return course;
  } catch (error) {
    console.error('Error fetching GitHub course:', error.message);
    throw new Error('Failed to fetch course details');
  }
};

module.exports = {
  getGitHubCourses,
  getGitHubCourseById
};
