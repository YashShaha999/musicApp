import { Link } from "react-router-dom";

const AlbumCard = ({ album }) => {
  return (
    <Link to={`/album/${album._id}`}>
      <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
        <div className="bg-purple-600 w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 2a1 1 0 00-1 1v2.126A4.997 4.997 0 005 10c0 2.761 2.239 5 5 5s5-2.239 5-5a4.997 4.997 0 00-3-4.874V3a1 1 0 00-1-1H9z" />
            <path d="M9 9a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-center text-sm truncate">
          {album.title}
        </h3>
        <p className="text-gray-400 text-xs text-center truncate">
          By {album.artist?.username || "Unknown Artist"}
        </p>
        <p className="text-gray-500 text-xs text-center mt-1">
          {album.musics?.length || 0} songs
        </p>
      </div>
    </Link>
  );
};

export default AlbumCard;
