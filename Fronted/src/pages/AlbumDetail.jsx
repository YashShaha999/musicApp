import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import MusicCard from "../components/MusicCard";

const AlbumDetail = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlbum();
  }, [albumId]);

  const fetchAlbum = async () => {
    try {
      const response = await API.get(`/music/albums/${albumId}`);
      setAlbum(response.data.album);
    } catch (error) {
      setError("Failed to load album");
      console.error("Error fetching album:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error || !album) {
    return (
      <div className="text-center text-red-500">
        {error || "Album not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 00-1 1v2.126A4.997 4.997 0 005 10c0 2.761 2.239 5 5 5s5-2.239 5-5a4.997 4.997 0 00-3-4.874V3a1 1 0 00-1-1H9z" />
              <path d="M9 9a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">
              {album.title}
            </h1>
            <p className="text-gray-400 text-sm">By {album.artist?.username}</p>
            <p className="text-gray-500 text-xs">
              {album.musics?.length || 0} songs
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-3">Songs</h2>
      <div className="space-y-3">
        {album.musics?.length === 0 ? (
          <p className="text-gray-400">No songs in this album</p>
        ) : (
          album.musics?.map((music) => (
            <MusicCard key={music._id} music={music} />
          ))
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
