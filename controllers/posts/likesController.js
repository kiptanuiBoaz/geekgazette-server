const Post = require("../../model/Posts"); //Post model

const updateLikes = async (req, res) => {
    //check if id is provided
    if (!req?.body?.postId) return res.status(400).json({ "message": "postId paramater is required" });

    const { userEmail, date, postId } = req.body;
    //grab the post with the sent id from db
    const post = await Post.findOne({ _id: postId }).exec();

    if (!post) return res.status(204).json({ "message": `No post matches ID ${id}` });

    try {
        let newLikes = [];
        if (post.likes.some(like => like.userEmail === userEmail)) {
            //if already liked remove it
            newLikes = post.likes.filter(like => like.userEmail !== userEmail);
        } else {
            //not liked
            newLikes = [...post.likes, { userEmail, date }]
        }
        post.likes = newLikes;

        //add updated post to db
        const result = await post.save();
        //send a success response
        return res.status(200).json({userEmail,date});

    } catch (err) {
        console.log(err);
    }
}

module.exports = { updateLikes };
