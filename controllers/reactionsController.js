const Post = require("../model/Post"); //Post model

const updateReactions = async (req, res) => {
    //check if id is provided
    if (!req?.body?.id) return res.status(400).json({ "message": "id paramater is required" });

    const { reaction, userId, id } = req.body;

    //grab the post with the sent id from db
    const post = await Post.findOne({ _id: id }).exec();

    if (!post) return res.status(204).json({ "message": `No post matches ID ${id}` });

    try {

        if (post.reactions[reaction].some(reaction => reaction.userId === userId)) {
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