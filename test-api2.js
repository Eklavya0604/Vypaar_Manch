const http = require('https');

const data = JSON.stringify({
  email: 'test' + Date.now() + '@example.com',
  password: 'password123',
  full_name: 'Test Deploy'
});

const options = {
  hostname: 'vypaar-manch-backend-ochre.vercel.app',
  port: 443,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
