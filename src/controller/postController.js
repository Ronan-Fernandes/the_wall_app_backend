const postModel = require("../model/postModel");

const getPosts = async (req, res) => {
  try {
    const { query } = req;

    const posts = await postModel.findPosts(query);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: `Something whent wrong erro: ${error}`,
    });
  }
};

module.exports = {
  getPosts,
};
