const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BlogSchema = new Schema({
    blogId: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    userName: String,
    headImg: String,
    blogTitle: String,
    blogPostImg: String,
    createTime: String,
    lastChangeTime: String,
    content: [],
    itap: String,
    collectNumber: Number,
    likeNumber: Number,
    permission: Number
}, { collection: 'blog', versionKey: false });

module.exports = mongoose.model('blog', BlogSchema);
