const Posts = require("../../model/Posts"); //Post model
const mongoose = require("mongoose")

const createNewComment = async (req, res) => {
    //check if id is provided
    if (!req?.body?.postId) return res.status(400).json({ "message": "id paramater is required" });

    const { userEmail, date, text, postId } = req.body;
    //grab the post with the sent id from db
    const post = await Posts.findOne({ _id: postId }).exec();

    if (!post) return res.status(204).json({ "message": `No post matches ID ${postId}` });

    try {
        //spread the existing comment in the existing comments array
        post.comments = [
            ...post.comments,
            {
                userEmail,
                date,
                text
            }
        ];

        //add updated post to db
        const result = await post.save();
        //send a success response
        return res.status(200).json(result);

    } catch (err) {
        console.log(err);
    }
}

const deleteComment = async (req, res) => {
    //check if id is provided
    if (!req?.body?.postId) return res.status(400).json({ "message": "id paramater is required" });
    const { postId, commentId } = req.body;

    try {
        //grab the post with the sent id from db
        const post = await Posts.findOne({ _id: postId }).exec();
        if (!post) {
            return res.status(404).json({ message: `Post with id ${postId} not found` });
        }

        //remove the comment with the matching id from the db
        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        const result = await post.save();

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
    }
}

module.exports = { createNewComment, deleteComment };
