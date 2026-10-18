import { useState, useRef, useEffect } from "react";
import { useMusic } from "../context/MusicContext";

const MusicCard = ({ music }) => {
  const {
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    audioRef,
    setIsPlaying,
  } = useMusic();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentSong = currentSong?.url === music.url;

  const togglePlay = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    if (isCurrentSong) {
      if (isPlaying) {
        pauseSong();
      } else {
        await playSong(music);
      }
    } else {
      await playSong(music);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isCurrentSong && audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnd = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      const handlePause = () => {
        setIsPlaying(false);
      };
      const handleError = (e) => {
        console.log("Audio error:", e);
        setIsLoading(false);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", handleEnd);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("error", handleError);

      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", handleEnd);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("error", handleError);
      };
    }
  }, [isCurrentSong, audioRef, setIsPlaying]);

  const handleProgressChange = (e) => {
    if (audioRef.current && isCurrentSong) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // ✅ FIXED: Get artist name with proper fallback
  const getArtistName = () => {
    // If no artist at all
    if (!music.artist) {
      return "Unknown Artist";
    }

    // If artist is a string (ObjectId) - not populated
    if (typeof music.artist === "string") {
      return "Unknown Artist";
    }

    // If artist is an object
    if (typeof music.artist === "object") {
      // Check for username
      if (music.artist.username) {
        return music.artist.username;
      }
      // Check for name
      if (music.artist.name) {
        return music.artist.name;
      }
    }

    return "Unknown Artist";
  };

  return (
    <div
      className={`rounded-lg p-4 transition-all duration-300 ${
        isCurrentSong && isPlaying
          ? "bg-blue-900/50 border border-blue-500/50 shadow-lg shadow-blue-500/20"
          : "bg-gray-800 hover:bg-gray-700"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              isCurrentSong && isPlaying ? "bg-green-500" : "bg-blue-600"
            }`}
          >
            {isCurrentSong && isPlaying ? (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-2 12V6l6 4-6 4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.999 4.999 0 005 14c-2.209 0-4 1.343-4 3s1.791 3 4 3 4-1.343 4-3V8.82l8-1.6v5.894A4.999 4.999 0 0015 14c-2.209 0-4 1.343-4 3s1.791 3 4 3 4-1.343 4-3V3z" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-sm truncate ${
                isCurrentSong && isPlaying ? "text-green-400" : "text-white"
              }`}
            >
              {music.title}
              {isCurrentSong && isPlaying && (
                <span className="ml-2 text-xs text-green-400">● Playing</span>
              )}
              {isLoading && isCurrentSong && (
                <span className="ml-2 text-xs text-yellow-400">Loading...</span>
              )}
            </h3>
            <p className="text-gray-400 text-xs">By {getArtistName()}</p>
          </div>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              isCurrentSong && isPlaying
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : isCurrentSong && isPlaying ? (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4l12 6-12 6V4z" />
              </svg>
            )}
          </button>
        </div>

        {isCurrentSong && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs flex-shrink-0 min-w-[32px]">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
              }}
            />

            <span className="text-gray-400 text-xs flex-shrink-0 min-w-[32px]">
              {formatTime(duration)}
            </span>

            <div className="flex items-center gap-1 flex-shrink-0">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 3a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h4zM12 7a1 1 0 011 1v4a1 1 0 01-2 0V8a1 1 0 011-1z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-12 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicCard;
