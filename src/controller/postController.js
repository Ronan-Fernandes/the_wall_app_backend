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

const saveNewPost = async (req, res) => {
  try {
    const { user: { name, userId }, body: { content, title } } = req;
    await postModel.createPost({
      title,
      content,
      userId,
      name,
    });
    return res.status(201).json({
      message: "Post succefully created",
    });
  } catch (error) {
    return res.status(500).json({
      error: `Something whent wrong erro: ${error}`,
    });
  }
};

module.exports = {
  getPosts,
  saveNewPost,
};
