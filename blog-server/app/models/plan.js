const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PlanSchema = new Schema({
    planId: {
        type: String,
        unique: true,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    planTitle: String,
    content: String,
    status: Number,
    createTime: String,
    isAlert: Boolean,
    alertTime: String
}, { collection: 'plan', versionKey: false });

module.exports = mongoose.model('plan', PlanSchema);
