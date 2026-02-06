const fetch = require('node-fetch');

async function testRegister() {
    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Artist',
                email: 'test' + Date.now() + '@example.com',
                password: 'password123',
                role: 'user'
            })
        });
        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', data);
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

testRegister();
