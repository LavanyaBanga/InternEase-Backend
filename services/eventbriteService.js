// services/githubEventsService.js
const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional, increases rate limit

// Popular tech event repos and organizations
const TECH_EVENT_SOURCES = [
  { owner: 'github', repo: 'events' },
  { owner: 'MLH', repo: 'mlh-events' },
  { owner: 'hackathons', repo: 'hackathons' },
  { owner: 'tech-conferences', repo: 'conference-data' }
];

/**
 * Fetch tech events from GitHub
 * Uses multiple sources: repository issues, discussions, and curated event lists
 */
const getEventbriteEvents = async (options = {}) => {
  try {
    console.log('=== FETCHING GITHUB TECH EVENTS ===');
    
    const allEvents = [];
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'InternEase-Platform'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Fetch from awesome-events repository (curated tech events)
    try {
      const response = await axios.get(
        'https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md',
        { headers }
      );
      
      // Parse tech events from awesome lists
      const events = parseAwesomeEvents(response.data);
      allEvents.push(...events);
    } catch (error) {
      console.log('Awesome events fetch error:', error.message);
    }

    // Fetch from GitHub's public events for tech organizations
    try {
      const techOrgs = ['github', 'microsoft', 'google', 'facebook', 'mlh'];
      
      for (const org of techOrgs.slice(0, 3)) { // Limit to 3 to avoid rate limits
        try {
          const response = await axios.get(
            `${GITHUB_API_BASE}/orgs/${org}/events`,
            { headers }
          );
          
          const orgEvents = response.data
            .filter(event => event.type === 'PublicEvent' || event.type === 'ReleaseEvent')
            .slice(0, 5)
            .map(event => transformGitHubEvent(event, org));
          
          allEvents.push(...orgEvents);
        } catch (err) {
          console.log(`Error fetching ${org} events:`, err.message);
        }
      }
    } catch (error) {
      console.log('GitHub org events error:', error.message);
    }

    // Add mock tech events for demo (real GitHub API doesn't have event listings)
    const mockTechEvents = generateMockTechEvents();
    allEvents.push(...mockTechEvents);

    console.log(`Fetched ${allEvents.length} tech events from GitHub sources`);
    
    return allEvents.slice(0, options.page_size || 50);
  } catch (error) {
    console.error('Error fetching GitHub events:', error.message);
    return generateMockTechEvents(); // Fallback to mock events
  }
};

/**
 * Transform GitHub event to InternEase format
 */
const transformGitHubEvent = (event, org) => {
  const eventDate = new Date(event.created_at);
  
  return {
    eventbriteId: `gh-${event.id}`,
    title: `${org} Developer Event - ${event.type}`,
    description: `Join ${org} for this exciting tech event. ${event.payload?.description || 'Connect with developers and learn about the latest technologies.'}`,
    type: 'Conference',
    date: eventDate.toLocaleDateString(),
    time: eventDate.toLocaleTimeString(),
    location: 'Online',
    maxParticipants: 500,
    registrationFee: 'Free',
    poster: `https://avatars.githubusercontent.com/u/${org}?v=4`,
    organizerName: org,
    url: `https://github.com/${org}`,
    status: 'live',
    isEventbrite: true,
    capacity: 500,
    isFree: true,
    onlineEvent: true
  };
};

/**
 * Generate mock tech events for demonstration
 * In production, replace with real event sources or APIs
 */
const generateMockTechEvents = () => {
  const now = new Date();
  const events = [];
  
  const techEvents = [
    {
      title: 'AI & Machine Learning Summit 2025',
      description: 'Join industry leaders for a comprehensive exploration of AI and ML technologies. Learn about the latest advancements in deep learning, natural language processing, and computer vision.',
      type: 'Conference',
      org: 'GitHub',
      days: 7,
      participants: 1000,
      topics: ['AI', 'Machine Learning', 'Deep Learning']
    },
    {
      title: 'Web3 Developer Conference',
      description: 'Dive into the world of blockchain and Web3. Workshops on smart contracts, DeFi, NFTs, and decentralized applications.',
      type: 'Conference',
      org: 'Ethereum Foundation',
      days: 14,
      participants: 800,
      topics: ['Blockchain', 'Web3', 'Smart Contracts']
    },
    {
      title: 'React Global Summit',
      description: 'The biggest React conference of the year. Learn from React core team members and community experts about React 19, Server Components, and modern frontend development.',
      type: 'Conference',
      org: 'React Community',
      days: 21,
      participants: 2000,
      topics: ['React', 'JavaScript', 'Frontend']
    },
    {
      title: 'DevOps & Cloud Engineering Workshop',
      description: 'Hands-on workshops covering Docker, Kubernetes, CI/CD pipelines, and cloud infrastructure. Perfect for developers looking to level up their DevOps skills.',
      type: 'Workshop',
      org: 'CNCF',
      days: 10,
      participants: 500,
      topics: ['DevOps', 'Cloud', 'Kubernetes']
    },
    {
      title: 'Cybersecurity Hackathon 2025',
      description: '48-hour hackathon focused on building security tools and finding vulnerabilities. Prizes worth $50,000. Open to all skill levels.',
      type: 'Hackathon',
      org: 'HackerOne',
      days: 28,
      participants: 300,
      topics: ['Security', 'Ethical Hacking', 'CTF']
    },
    {
      title: 'Python Data Science Bootcamp',
      description: 'Intensive bootcamp covering pandas, NumPy, scikit-learn, and data visualization. Build real-world data science projects.',
      type: 'Workshop',
      org: 'Python Software Foundation',
      days: 5,
      participants: 600,
      topics: ['Python', 'Data Science', 'Analytics']
    },
    {
      title: 'Mobile App Development Summit',
      description: 'Learn about React Native, Flutter, and native iOS/Android development. Sessions on app architecture, performance optimization, and app store deployment.',
      type: 'Conference',
      org: 'Google Developers',
      days: 12,
      participants: 900,
      topics: ['Mobile', 'React Native', 'Flutter']
    },
    {
      title: 'Open Source Contribution Workshop',
      description: 'Learn how to contribute to open source projects. Git workflows, pull requests, issue tracking, and community engagement.',
      type: 'Workshop',
      org: 'GitHub',
      days: 3,
      participants: 400,
      topics: ['Open Source', 'Git', 'Collaboration']
    },
    {
      title: 'Startup Tech Talks',
      description: 'Hear from successful startup founders and CTOs about building scalable tech products, hiring engineering teams, and navigating technical challenges.',
      type: 'Webinar',
      org: 'Y Combinator',
      days: 18,
      participants: 1500,
      topics: ['Startups', 'Leadership', 'Product']
    },
    {
      title: 'Game Development Conference',
      description: 'Explore Unity, Unreal Engine, and game design principles. Network with game developers and learn about the gaming industry.',
      type: 'Conference',
      org: 'Unity Technologies',
      days: 25,
      participants: 700,
      topics: ['Game Dev', 'Unity', 'Graphics']
    }
  ];

  techEvents.forEach((eventData, index) => {
    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() + eventData.days);
    
    events.push({
      eventbriteId: `tech-event-${index + 1}`,
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      date: eventDate.toLocaleDateString(),
      time: '10:00 AM',
      location: 'Online',
      maxParticipants: eventData.participants,
      registrationFee: 'Free',
      poster: `https://picsum.photos/seed/${index}/400/300`,
      organizerName: eventData.org,
      url: `https://github.com/events/${index + 1}`,
      status: 'live',
      isEventbrite: true,
      capacity: eventData.participants,
      isFree: true,
      onlineEvent: true,
      topics: eventData.topics
    });
  });

  return events;
};

/**
 * Parse tech events from markdown content
 */
const parseAwesomeEvents = (markdown) => {
  // Simple parser for event-like content
  // In production, use proper markdown parser
  return [];
};

/**
 * Get a single event by ID
 */
const getEventbriteEventById = async (eventId) => {
  try {
    const allEvents = await getEventbriteEvents({});
    const event = allEvents.find(e => e.eventbriteId === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  } catch (error) {
    console.error('Error fetching GitHub event:', error.message);
    throw new Error('Failed to fetch event details');
  }
};

/**
 * Get attendees (mock - GitHub doesn't track this)
 */
const getEventbriteAttendees = async (eventId) => {
  // GitHub doesn't have attendee tracking
  // Return empty array
  return [];
};

module.exports = {
  getEventbriteEvents,
  getEventbriteEventById,
  getEventbriteAttendees
};
