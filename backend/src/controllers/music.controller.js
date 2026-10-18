const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");
const jwt = require("jsonwebtoken");

async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file || !title) {
      return res
        .status(400)
        .json({ message: "Song title and audio file are required" });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      url: result.url,
      title,
      artist: req.user.id,
    });

    return res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        url: music.url,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (error) {
    console.error("Create Music Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to create music" });
  }
}

async function createAlbum(req, res) {
  try {
    const { title, musics } = req.body;

    if (!title || !musics || !Array.isArray(musics) || musics.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and songs selection are required" });
    }

    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics: musics,
    });

    // Populate the album before sending response
    const populatedAlbum = await albumModel
      .findById(album._id)
      .populate("artist", "username email")
      .populate({
        path: "musics",
        populate: {
          path: "artist",
          select: "username email",
        },
      });

    return res.status(201).json({
      message: "Album created successfully",
      album: {
        id: populatedAlbum._id,
        title: populatedAlbum.title,
        artist: populatedAlbum.artist,
        musics: populatedAlbum.musics,
      },
    });
  } catch (error) {
    console.error("Create Album Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to create album" });
  }
}

async function getAllMusics(req, res) {
  try {
    const musics = await musicModel
      .find()
      .limit(20)
      .populate("artist", "username");
    return res.status(200).json({
      message: "Music fetched successfully",
      musics: musics,
    });
  } catch (error) {
    console.error("Get All Musics Error:", error);
    return res.status(500).json({ message: "Failed to fetch music" });
  }
}

async function getAllAlbums(req, res) {
  try {
    const albums = await albumModel
      .find()
      .populate("artist", "username email")
      .populate({
        path: "musics",
        populate: {
          path: "artist",
          select: "username email",
        },
      });

    return res.status(200).json({
      message: "Albums fetched successfully",
      albums: albums,
    });
  } catch (error) {
    console.error("Get All Albums Error:", error);
    return res.status(500).json({ message: "Failed to fetch albums" });
  }
}

async function getAllAlbumsId(req, res) {
  try {
    const albumId = req.params.albumId;

    const album = await albumModel
      .findById(albumId)
      .populate("artist", "username email")
      .populate({
        path: "musics",
        populate: {
          path: "artist",
          select: "username email",
        },
      });

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    return res.status(200).json({
      message: "Album fetched successfully",
      album: album,
    });
  } catch (error) {
    console.error("Get Album By Id Error:", error);
    return res.status(500).json({ message: "Failed to fetch album details" });
  }
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAllAlbumsId,
};
