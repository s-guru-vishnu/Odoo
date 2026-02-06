const http = require('http');

const data = JSON.stringify({
    name: 'Test User',
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    role: 'user'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', body);
    });
});

req.on('error', (e) => {
    console.error('Problem with request:', e.message);
});

req.write(data);
req.end();
