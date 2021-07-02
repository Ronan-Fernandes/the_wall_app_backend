const router = require("express").Router();
const postController = require("../controller/postController");
const joisScheema = require("../middlewares/joiScheemas");
const joiMiddleware = require("../middlewares/joiMiddleware");
const { validateJWTToken } = require("../service/jwtAuth");

router.get("/", postController.getPosts);
router.post("/", validateJWTToken, joiMiddleware(joisScheema.createPostPOST, "body"), postController.saveNewPost);
router.put("/:id", validateJWTToken, joiMiddleware(joisScheema.editPostPUT, "params"), postController.editPost);

module.exports = router;
