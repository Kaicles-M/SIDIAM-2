const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 1, role: 'teacher' }, 'supersecret', { expiresIn: '1h' });

fetch('http://localhost:4000/api/schools', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ name: 'Escola Teste', city: 'SP' })
}).then(async (res) => {
  console.log('status', res.status);
  console.log(await res.text());
});
