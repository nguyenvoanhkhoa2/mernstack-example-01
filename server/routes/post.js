const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Post = require("../models/Post");

/**
 * @openapi
 * /api/posts:
 *  get:
 *    tags:
 *    - posts
 *    description: Get posts
 *    responses:
 *      200:
 *        description: App is up and running
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @openapi
 * /api/posts:
 *  post:
 *    tags:
 *    - posts
 *    description: Create post
 *    responses:
 *      200:
 *        description: App is up and running
 *    requestBody:
 *      description: ''
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/post'
 *        text/json:
 *          schema:
 *            $ref: '#/components/schemas/post'
 *        application/*+json:
 *          schema:
 *            $ref: '#/components/schemas/post'
 */
router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  // Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @openapi
 * /api/posts/{id}:
 *  put:
 *    tags:
 *    - posts
 *    description: Update post
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: App is up and running
 *    requestBody:
 *      description: ''
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/post'
 *        text/json:
 *          schema:
 *            $ref: '#/components/schemas/post'
 *        application/*+json:
 *          schema:
 *            $ref: '#/components/schemas/post'
 */
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  // Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    let updatedPost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    // User not authorised to update post or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    res.json({
      success: true,
      message: "Excellent progress!",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @openapi
 * /api/posts/{id}:
 *  delete:
 *    tags:
 *    - posts
 *    description: Delete post
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: App is up and running
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // User not authorised or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
