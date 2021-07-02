const router = require("express").Router();
const postController = require("../controller/postController");
const joisScheema = require("../middlewares/joiScheemas");
const joiMiddleware = require("../middlewares/joiMiddleware");
const { validateJWTToken } = require("../service/jwtAuth");
const validatePosts = require("../middlewares/postValidations");

router.get("/", postController.getPosts);
router.post("/", validateJWTToken, joiMiddleware(joisScheema.createPostPOST, "body"), postController.saveNewPost);
router.put("/:id", validateJWTToken, joiMiddleware(joisScheema.paramsId, "params"), validatePosts, postController.editPost);
router.delete("/:id", validateJWTToken, joiMiddleware(joisScheema.paramsId, "params"), validatePosts, postController.deletePost);

module.exports = router;
