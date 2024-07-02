const { model, Schema }=require('mongoose');

const ruleSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['privacy', 'terms', 'about'],
    },
})

const Rule = model('Rule', ruleSchema)
module.exports = Rule;
