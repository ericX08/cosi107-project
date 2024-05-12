import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Success from './Login/Success';
import XSS from './Login/Login_XSS';
import SuccessXSS from './Login/SuccessXSS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/Login_XSS" element={<XSS />} />
        <Route path="/SuccessXSS" element={<SuccessXSS />} />
      </Routes>
    </Router>
  );
}

export default App;
