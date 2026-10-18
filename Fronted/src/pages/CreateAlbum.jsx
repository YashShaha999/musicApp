import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const CreateAlbum = () => {
  const [title, setTitle] = useState("");
  const [selectedMusics, setSelectedMusics] = useState([]);
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMusics();
  }, []);

  const fetchMusics = async () => {
    try {
      const response = await API.get("/music");
      setMusics(response.data.musics);
    } catch (error) {
      console.error("Error fetching musics:", error);
    }
  };

  const handleMusicToggle = (musicId) => {
    setSelectedMusics((prev) =>
      prev.includes(musicId)
        ? prev.filter((id) => id !== musicId)
        : [...prev, musicId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await API.post("/music/album", {
        title,
        musics: selectedMusics,
      });
      setSuccess("Album created successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Create Album</h2>

      <div className="bg-gray-800 rounded-lg p-6">
        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">{error}</div>
        )}

        {success && (
          <div className="bg-green-600 text-white p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Album Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Select Songs</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {musics.length === 0 ? (
                <p className="text-gray-400">
                  No music available. Upload some music first!
                </p>
              ) : (
                musics.map((music) => (
                  <label
                    key={music._id}
                    className="flex items-center gap-3 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMusics.includes(music._id)}
                      onChange={() => handleMusicToggle(music._id)}
                      className="w-4 h-4"
                    />
                    <span className="text-white">{music.title}</span>
                    <span className="text-gray-400 text-sm">
                      by {music.artist?.username}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || selectedMusics.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Album"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbum;
