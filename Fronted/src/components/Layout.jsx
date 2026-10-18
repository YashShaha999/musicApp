import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../context/MusicContext";

const Layout = () => {
  const { audioRef, currentSong } = useMusic();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pb-24">
        <Outlet />
      </main>
      {/* Hidden global audio element */}
      <audio ref={audioRef} src={currentSong?.url} className="hidden" />
    </div>
  );
};

export default Layout;
