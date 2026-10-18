import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import MusicCard from "../components/MusicCard";
import AlbumCard from "../components/AlbumCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [musicsRes, albumsRes] = await Promise.all([
        API.get("/music"),
        API.get("/music/albums"),
      ]);
      setMusics(musicsRes.data.musics || []);
      setAlbums(albumsRes.data.albums || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-white mb-3">
          Welcome to MusicApp
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Please login or register to access the music library
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg text-sm"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">🎵 Latest Music</h2>
        <div className="space-y-3">
          {musics.length === 0 ? (
            <p className="text-gray-400 text-sm">No music uploaded yet</p>
          ) : (
            musics.map((music) => <MusicCard key={music._id} music={music} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">📀 Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {albums.length === 0 ? (
            <p className="text-gray-400 text-sm col-span-full">
              No albums created yet
            </p>
          ) : (
            albums.map((album) => <AlbumCard key={album._id} album={album} />)
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
