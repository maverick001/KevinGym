import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gym-green text-white px-8 py-3 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold tracking-wide">Kevin's Gym</Link>
        <p className="text-xs text-green-200 mt-0.5">Family Fitness at Brisbane</p>
      </div>
      <div className="flex items-center gap-6 text-sm">
        {user ? (
          <>
            <a href="mailto:admin@kevinsgym.com" className="hover:text-green-200">Contact Us</a>
            <button onClick={handleLogout} className="hover:text-green-200">Log Out</button>
          </>
        ) : (
          <>
            <a href="mailto:admin@kevinsgym.com" className="hover:text-green-200">Contact Us</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
