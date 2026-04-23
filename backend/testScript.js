async function test() {
  try {
    const email = `test${Date.now()}@test.com`;
    await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email, password: 'password', role: 'customer' })
    });
    
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    const res = await fetch('http://localhost:5000/api/services', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        mobile_no: '1234567890',
        email,
        car_model: 'Test Model',
        req_service: 'General Servicing',
        date: '2023-10-10',
        pick_drop: false
      })
    });
    const data = await res.json();
    console.log("Success:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
