const Post = require("../model/Post"); //Post model


const getPosts = async (req, res) => {
    const posts = await Post.find();//returns all the posts

    if (!posts) {
        //handle emptydb
        return res.status(201).json({ "message": "No posts found!" });
    } else {
        //success operation
        return res.status(200).json(posts);
    }
}

const createNewPost = async (req, res) => {
    //check for required fields
    if (!req?.body?.body || !req?.body?.title) {
        return res.status(400).json({ "message": " Body and title are required" })
    }
    //check for missing image URL
    if (!req.body?.imgUrl) {
        return res.status(400).json({ "message": "Image URL is required" })
    }

    try {
        const { body, imgUrl, title, userId, date } = req.body;

        //create a new post record
        const result = await Post.create({
            title,
            body,
            imgUrl,
            userId,
            date
        })
        return res.status(201).json(result);

    } catch (error) {
        console.error(error)
    }

}

const updatePost = async (req, res) => {
    //check if id is provided
    if (!req?.body?.id) return res.status(400).json({ "message": "id paramater is required" });

    //destrucure the data object
    const { body, imgUrl, title, userId, date, id } = req.body;
    //grab the post with the sent id from db
    const post = await Post.findOne({ _id: id }).exec();

    //send !found when post  doen't exist
    if (!post) return res.status(204).json({ "message": `No post matches ID ${id}` });

    //hydrate the post variable with recieved data
    if (body) post.body = body;
    if (imgUrl) post.imgUrl = imgUrl;
    if (title) post.title = title;

    //add updated post to db
    const result = await post.save();

    //send a success response
    return res.status(200).json(result);
}

const deletePost = async (req, res) => {

    if (!req?.body?.id) return res.status(400).json({ "message": "id paramater is required" });

    //find the post with `id`
    const post = await Post.findOne({ _id: req.body.id }).exec();//needs exec

    //send !found when post  doen't exist
    if (!post) return res.status(204).json({ "message": `No post matches ID ${id}` });

    //delete in db
    const result = await Post.deleteOne({ _id: req.body.id });
    //success message
    return res.status(200).json(result);
}

const getPost = async (req, res) => {

    if (!req?.params?.id) return res.status(400).json({ "message": "id paramater is required" });

    //find the post with id
    const post = await Post.findOne({ _id: req.params.id }).exec();//needs exec
    //send !found when post  doesn't exist
    if (!post) return res.status(204).json({ "message": `No emmployee matches ID ${req.params.id}` });
    return res.status(200).json(post);
}

//export the fns
module.exports = {
    getPosts,
    deletePost,
    getPost,
    updatePost,
    createNewPost,
}