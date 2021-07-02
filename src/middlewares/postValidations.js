const postModel = require("../model/postModel");

const validatePosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const [post] = await postModel.findPosts({ _id: id });

    if (!post) {
      return res.status(404).json({
        message: "post not found",
      });
    }

    if (userId !== post.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      error: `Something whent wrong erro: ${error}`,
    });
  }
};

module.exports = validatePosts;
