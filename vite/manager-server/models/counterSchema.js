const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:String,
    sequence_value:Number
})


//关系绑定   Odm ORM
module.exports = mongoose.model('Counter',userSchema,'counters')