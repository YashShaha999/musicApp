import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, isArtist, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-white flex items-center gap-2"
          >
            <span>🎵</span>
            MusicApp
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm hidden sm:inline">
                  Welcome, {user?.username}
                </span>
                {isArtist && (
                  <>
                    <Link
                      to="/upload-music"
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Upload
                    </Link>
                    <Link
                      to="/create-album"
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Album
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
