const Post = require("../model/Post"); //Post model

const updateLikes = async (req, res) => {
    //check if id is provided
    if (!req?.body?.id) return res.status(400).json({ "message": "id paramater is required" });

    const { userId, date, id } = req.body;
    //grab the post with the sent id from db
    const post = await Post.findOne({ _id: id }).exec();

    if (!post) return res.status(204).json({ "message": `No post matches ID ${id}` });

    try {
        let newLikes = [];
        if (post.likes.some(like => like.userId === userId)) {
            //if already liked remove it
            newLikes = post.likes.filter(like => like.userId !== userId)
        } else {
            //not liked
            newLikes = [...post.likes, { userId, date }]
        }
        post.likes = newLikes;

        //add updated post to db
        const result = await post.save();
        //send a success response
        return res.status(200).json(result);

    } catch (err) {
        console.log(err);
    }
}

module.exports = { updateLikes };
