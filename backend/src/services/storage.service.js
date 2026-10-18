const { ImageKit } = require("@imagekit/nodejs");

function getImageKitClient() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key";
  return new ImageKit({
    privateKey,
  });
}

async function uploadFile(file) {
  const imageKitClient = getImageKitClient();
  const result = await imageKitClient.files.upload({
    file,
    fileName: "music_" + Date.now(),
    folder: "yt-complete-backend/music",
  });
  return result;
}

module.exports = { uploadFile };
