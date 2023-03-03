const Posts = require("../model/Posts"); //Post model

const updateReactions = async (req, res) => {
    //check if id is provided
    if (!req?.body?.postId) return res.status(400).json({ "message": "id paramater is required" });

    const { reaction, userId, postId } = req.body;

    //grab the post with the sent id from db
    const post = await Posts.findOne({ _id: postId }).exec();

    if (!post) return res.status(204).json({ "message": `No post matches ID ${postId}` });

    try {

        if (post.reactions[reaction].some(reaction => reaction === userId)) {
            //user already already reacted
            post.reactions[reaction] = post.reactions[reaction].filter(rId => rId !== userId)
        } else {
            //user reacting for the first time
            post.reactions[reaction] = [...post.reactions[reaction], userId]
        }

        const result = await post.save();
        return res.status(200).json(result);

    } catch (err) {
        console.error(err)
    }
}

module.exports = {updateReactions}