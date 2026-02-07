const { getDb } = require('../config/db');

const getCategories = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.query(`
            SELECT ct.tag as title, COUNT(c.id) as count 
            FROM course_tags ct
            JOIN courses c ON c.id = ct.course_id
            WHERE c.published = true 
            GROUP BY ct.tag
            ORDER BY count DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
};

const getCourses = async (req, res) => {
    try {
        const db = getDb();
        const { category, search } = req.query;

        let query = `
            SELECT 
                c.id, 
                c.title, 
                c.description, 
                c.image_url, 
                c.price, 
                c.created_at, 
                u.full_name as instructor,
                (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as students,
                (SELECT COALESCE(AVG(rating), 0) FROM reviews r WHERE r.course_id = c.id) as rating,
                (SELECT json_agg(tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags
            FROM courses c 
            LEFT JOIN users u ON c.course_admin = u.id 
            WHERE c.published = true
        `;

        const params = [];
        let paramCount = 1;

        if (search) {
            query += ` AND c.title ILIKE $${paramCount}`;
            params.push(`%${search}%`);
            paramCount++;
        }

        // If filtering by category (tag)
        if (category && category !== 'All') {
            query += ` AND EXISTS (SELECT 1 FROM course_tags ct WHERE ct.course_id = c.id AND ct.tag = $${paramCount})`;
            params.push(category);
            paramCount++;
        }

        query += ` ORDER BY c.created_at DESC`;

        const result = await db.query(query, params);

        // Transform data to match frontend expectations
        const courses = result.rows.map(course => ({
            id: course.id,
            title: course.title,
            instructor: course.instructor || 'Unknown Instructor',
            image: course.image_url, // Can be null
            category: course.tags && course.tags.length > 0 ? course.tags[0] : 'General',
            rating: parseFloat(parseFloat(course.rating).toFixed(1)),
            students: parseInt(course.students),
            duration: "10 hours", // Placeholder as it's not in DB easily without summing lessons
            price: parseFloat(course.price),
            tags: course.tags || []
        }));

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
    }
};

const getBlogPosts = async (req, res) => {
    // Static data since no Blog table exists
    const posts = [
        {
            id: 1,
            title: "The Future of Online Learning: Trends to Watch in 2024",
            excerpt: "Discover the emerging technologies and methodologies that are reshaping how we learn online.",
            author: "Dr. Sarah Mitchell",
            date: "Feb 5, 2026",
            readTime: "8 min read",
            category: "Education Trends"
        },
        {
            id: 2,
            title: "10 Essential Skills Every Web Developer Needs",
            excerpt: "Stay ahead in your development career with these must-have skills.",
            author: "Alex Turner",
            date: "Feb 3, 2026",
            readTime: "5 min read",
            category: "Development"
        },
        {
            id: 3,
            title: "How to Build a Successful Career in UI/UX Design",
            excerpt: "A comprehensive guide to breaking into the design industry.",
            author: "Lisa Park",
            date: "Feb 1, 2026",
            readTime: "6 min read",
            category: "Design"
        },
        {
            id: 4,
            title: "Digital Marketing Strategies That Actually Work",
            excerpt: "Proven tactics to grow your online presence and reach more customers.",
            author: "Mike Chen",
            date: "Jan 28, 2026",
            readTime: "7 min read",
            category: "Marketing"
        }
    ];

    res.json(posts);
};

const getCommunityUsers = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.query(`
            SELECT u.id, u.full_name as name, r.name as role 
            FROM users u
            JOIN roles r ON u.role_id = r.id
            ORDER BY r.name, u.full_name
        `);

        // Add random status since we don't track real-time status in DB
        const usersWithStatus = result.rows.map(user => ({
            ...user,
            status: Math.random() > 0.7 ? 'idle' : Math.random() > 0.9 ? 'dnd' : 'online'
        }));

        res.json(usersWithStatus);
    } catch (error) {
        console.error('Error fetching community users:', error);
        res.status(500).json({ message: 'Failed to fetch community users', error: error.message });
    }
};

// In-memory store for messages (reset on server restart)
const messagesStore = {
    'general': [
        { id: 1, user: 'Admin', role: 'ADMIN', avatar: 'A', content: 'Welcome to the LearnSphere Community! 🚀', time: '10:00 AM' },
        { id: 2, user: 'Sarah Jen', role: 'INSTRUCTOR', avatar: 'S', content: 'Hey everyone! Excited to be here.', time: '10:05 AM' },
        { id: 3, user: 'Mike Ross', role: 'LEARNER', avatar: 'M', content: 'Hello! Does anyone have resources for the React course?', time: '10:15 AM' },
    ],
    'announcements': [
        { id: 1, user: 'Admin', role: 'ADMIN', avatar: 'A', content: 'New UI/UX Course dropped! Check it out.', time: 'Yesterday' }
    ],
    'resources': [],
    'introductions': [],
    'help-needed': [],
    'showcase': []
};

// In-memory store for channels
const channels = [
    { id: 'announcements', name: 'announcements', type: 'text', unread: 2 },
    { id: 'general', name: 'general', type: 'text', unread: 0 },
    { id: 'resources', name: 'resources', type: 'text', unread: 5 },
    { id: 'introductions', name: 'introductions', type: 'text', unread: 0 },
    { id: 'help-needed', name: 'help-needed', type: 'text', unread: 0 },
    { id: 'showcase', name: 'showcase', type: 'text', unread: 0 },
];

const getChannels = (req, res) => {
    res.json(channels);
};

const createChannel = (req, res) => {
    const { name, type = 'text' } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Channel name is required' });
    }

    const id = name.toLowerCase().replace(/\s+/g, '-');

    // Check if channel already exists
    if (channels.find(c => c.id === id)) {
        return res.status(400).json({ message: 'Channel already exists' });
    }

    const newChannel = {
        id,
        name,
        type,
        unread: 0
    };

    channels.push(newChannel);
    messagesStore[id] = []; // Initialize messages for the new channel

    res.status(201).json(newChannel);
};

const getChannelMessages = (req, res) => {
    const { channelId } = req.params;
    const messages = messagesStore[channelId] || [];
    // Sort logic if needed, but array order is usually chronological for push
    res.json(messages);
};

const postMessage = (req, res) => {
    const { channelId } = req.params;
    const { user, role, avatar, content } = req.body;

    if (!messagesStore[channelId]) {
        messagesStore[channelId] = [];
    }

    const newMessage = {
        id: Date.now(),
        user: user || 'Guest',
        role: role || 'LEARNER',
        avatar: avatar || 'G',
        content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    messagesStore[channelId].push(newMessage);
    res.status(201).json(newMessage);
};

module.exports = {
    getCategories,
    getCourses,
    getBlogPosts,
    getCommunityUsers,
    getChannels,
    createChannel,
    getChannelMessages,
    postMessage
};
