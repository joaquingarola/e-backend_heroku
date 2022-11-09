const {Schema, model} = require('mongoose')

const MsgSchema = new Schema({
  author: {
    email: {type: String, required: true, default:''},
    name: {type: String, required: true, default:''},
    lastname: {type: String, required: true, default:''},
    age: {type: String, required: true, default:''},
    username: {type: String, required: true, default:''},
    avatar: {type: String, required: true, default:''},
  },
  text: {type: String, required: true, default:''},
  timestamp: { type: Date, default: Date.now }
});
  


const MsgModel = model('mensajes', MsgSchema);


module.exports =  {MsgModel, MsgSchema}
 