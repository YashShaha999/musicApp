import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MusicProvider } from "./context/MusicContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadMusic from "./pages/UploadMusic";
import CreateAlbum from "./pages/CreateAlbum";
import AlbumDetail from "./pages/AlbumDetail";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        {" "}
        {/* 👈 Add this */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-music"
                element={
                  <ProtectedRoute artistOnly>
                    <UploadMusic />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-album"
                element={
                  <ProtectedRoute artistOnly>
                    <CreateAlbum />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/album/:albumId"
                element={
                  <ProtectedRoute>
                    <AlbumDetail />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </MusicProvider>{" "}
      {/* 👈 Add this */}
    </AuthProvider>
  );
}

export default App;
