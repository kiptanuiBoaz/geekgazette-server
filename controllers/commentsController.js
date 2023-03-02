const Post = require("../model/Post"); //Post model

const createNewComment = async (req, res) => {
    //check if id is provided
    if (!req?.body?.id) return res.status(400).json({ "message": "id paramater is required" });

    const { userId, date, commentId, text } = req.body;
    //grab the post with the sent id from db
    const post = await Post.findOne({ _id: id }).exec();

    if (!post) return res.status(204).json({ "message": `No post matches ID ${id}` });

    try {
        //spread the existing comment in the existing comments array
        post.comments = [...post.comments, { userId, date, text, commentId }];

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
    if (!req?.body?.id) return res.status(400).json({ "message": "id paramater is required" });

    //grab the post with the sent id from db
    const post = await Post.findOne({ _id: req.body.id }).exec();
    
    post.comments = post.comments.filter(comment => comment.commentId !== req.body.commentId);
    const result = await post.save();

    return res.status(200).json(result);

}

module.exports = { createNewComment, deleteComment};
