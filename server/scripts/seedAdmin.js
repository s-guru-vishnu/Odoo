const db = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    const name = 'System Admin';
    const email = 'admin@example.com';
    const password = 'adminpassword123';
    const role = 'admin';

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            [name, email, hashedPassword, role]
        );

        console.log('-------------------------------');
        console.log('Admin user created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
