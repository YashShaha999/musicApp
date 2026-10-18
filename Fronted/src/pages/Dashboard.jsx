import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isArtist } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">
          Welcome, {user?.username}!
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Role</p>
            <p className="text-white font-semibold text-sm capitalize">
              {user?.role}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Email</p>
            <p className="text-white font-semibold text-sm truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {isArtist && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/upload-music"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-3xl mb-1">🎵</div>
            <h3 className="text-white font-semibold text-sm">Upload Music</h3>
            <p className="text-gray-300 text-xs">Share your music</p>
          </Link>

          <Link
            to="/create-album"
            className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-3xl mb-1">📀</div>
            <h3 className="text-white font-semibold text-sm">Create Album</h3>
            <p className="text-gray-300 text-xs">Organize your songs</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
