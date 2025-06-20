import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Library } from './pages/Library';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Donate } from './pages/Donate';
import { Dashboard } from './pages/Dashboard';
import { ToastContainer } from './components/UI/Toast';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/library" element={<Library />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;