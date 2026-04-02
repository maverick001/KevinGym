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
            <Link
              to={user.role === 'vendor' ? '/vendor-panel' : '/class-booking'}
              className="hover:text-green-200"
            >Classes</Link>
            <Link to="/member-panel" className="hover:text-green-200">Members</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="hover:text-green-200">Admin</Link>
            )}
            <button onClick={handleLogout} className="hover:text-green-200">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-200">Contact Us</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
