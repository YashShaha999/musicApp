import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const UploadMusic = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("music", file);

    try {
      const response = await API.post("/music/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Music uploaded successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Music</h2>

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
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Audio File</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Music"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMusic;
