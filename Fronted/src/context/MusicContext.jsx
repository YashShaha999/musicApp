import React, { createContext, useContext, useRef, useState } from "react";

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playSong = async (song) => {
    // If same song, toggle play/pause
    if (currentSong?.url === song.url) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Playback error:", error);
        }
      }
      return;
    }

    // Stop current song
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Set new song
    setCurrentSong(song);

    // Wait for state update and audio element to be ready
    setTimeout(async () => {
      if (audioRef.current) {
        try {
          // Load the audio
          audioRef.current.load();
          // Wait a bit for loading
          await new Promise((resolve) => setTimeout(resolve, 100));
          // Play
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Playback error:", error);
          setIsPlaying(false);
        }
      }
    }, 50);
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const value = {
    currentSong,
    isPlaying,
    audioRef,
    playSong,
    pauseSong,
    setIsPlaying,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};
