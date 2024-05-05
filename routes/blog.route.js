const blogrouter = require("express").Router();
const blogController = require("../controllers/blog.controller.js")
const isAuthenticated = require("../middlewares/isAuthenticated.js")

blogrouter.get("/read", blogController.read)
blogrouter.get("/readAll", blogController.readAll)
blogrouter.get("/readUserArticals", blogController.readUserArticals)
blogrouter.post("/write", isAuthenticated(process.env.KEY), blogController.write)
blogrouter.post("/delete", isAuthenticated(process.env.KEY), blogController.delete)
blogrouter.post("/publish", isAuthenticated(process.env.KEY), blogController.publish)
blogrouter.post("/archive", isAuthenticated(process.env.KEY), blogController.archive)
blogrouter.post("/readArchiveArticals", isAuthenticated(process.env.KEY), blogController.readArchiveArticals)
blogrouter.post("/readLikedArticals", isAuthenticated(process.env.KEY), blogController.readLikedArticals)
blogrouter.post("/readSavedArticals", isAuthenticated(process.env.KEY), blogController.readSavedArticals)
blogrouter.post("/like", isAuthenticated(process.env.KEY), blogController.like)








module.exports = blogrouter