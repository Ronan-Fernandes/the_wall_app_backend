const router = require("express").Router();
const postController = require("../controller/postController");

router.get("/", postController.getPosts);

module.exports = router;
