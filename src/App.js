import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Success from './Login/Success';
import XSS from './Login/Login_XSS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/Login_XSS" element={<XSS />} />
      </Routes>
    </Router>
  );
}

export default App;
