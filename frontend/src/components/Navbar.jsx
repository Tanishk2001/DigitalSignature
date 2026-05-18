import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken, removeUser } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          📝 Digital Signature
        </Link>
        <div className="flex gap-4">
          {authenticated ? (
            <>
              <Link to="/dashboard" className="hover:bg-blue-700 px-4 py-2 rounded">
                Dashboard
              </Link>
              <Link to="/audit" className="hover:bg-blue-700 px-4 py-2 rounded">
                Audit Trail
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:bg-blue-700 px-4 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
