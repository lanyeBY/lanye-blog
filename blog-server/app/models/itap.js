const mongoose = require('mongoose');
// 这里的流程官网上有，讲的很清楚，每一步是干什么的
const Schema = mongoose.Schema;
const itapSchema = new Schema({
    itapId: {
        type: String,
        required: true
    },
    itap: {
        type: String,
        required: true
    },
}, {
        collection: 'itap', // 这里是为了避免新建的表会带上 s 后缀
        versionKey: false // 不需要 __v 字段，默认是加上的
    });

module.exports = mongoose.model('itap', itapSchema);