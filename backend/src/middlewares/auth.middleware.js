const jwt = require("jsonwebtoken");

function getToken(req) {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

async function authArtist(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have access to create music" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function authUser(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (decoded.role !== "user" && decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have access" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { authArtist, authUser };
