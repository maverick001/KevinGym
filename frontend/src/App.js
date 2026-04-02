import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import MemberPanel from './pages/MemberPanel';
import AdminDashboard from './pages/AdminDashboard';
import VendorPanel from './pages/VendorPanel';
import ClassBookingPanel from './pages/ClassBookingPanel';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/member-panel" element={<MemberPanel />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/vendor-panel" element={<VendorPanel />} />
        <Route path="/class-booking" element={<ClassBookingPanel />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;
