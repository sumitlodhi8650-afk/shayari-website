const mongoose = require("mongoose");

const ShayariSchema = new mongoose.Schema({

  text: String,

  category: String,

  image: String,

  video: String,

  likes:{
    type:Number,
    default:0
  },
  views:{
type:Number,
default:0
},

  likedBy:[
    String
  ],

  comments:[
    {
      user:String,
      text:String,
      date:{
        type:Date,
        default:Date.now
      }
    }
  ]

},{timestamps:true});

module.exports = mongoose.model("Shayari", ShayariSchema);