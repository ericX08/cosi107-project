import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.set('fakeUserToken', '1234567890abcdef', { expires: 1 });
  }, []);

  const handleLogin = () => {
    // Vulnerable code that allows XSS attacks
    // const maliciousScript = `<script>alert(document.cookie);</script>`;
    // document.write(maliciousScript);

    navigate("/SuccessXSS");
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form style={{ marginBottom: '20px' }}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </form>
      {/* Vulnerable line that renders user input without sanitization */}
      <div dangerouslySetInnerHTML={{ __html: username }} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}