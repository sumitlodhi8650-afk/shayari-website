
console.log("🔥 BACKEND SERVER FILE RUNNING 🔥");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "myUltraSecretKey";

const ADMIN_EMAIL = "RakshaTheAdmin";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("Raksha@0906", 8);

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });
}

const Shayari = require("./models/Shayari");
const storage = multer.diskStorage({

destination: function(req,file,cb){

if(file.mimetype.startsWith("image")){
cb(null,"upload/images/");
}
else if(file.mimetype.startsWith("video")){
cb(null,"upload/videos/");
}
else{
cb(null,"upload/images/");
}

},

filename: function(req,file,cb){
 const ext = file.originalname.split(".").pop();
 const name = Date.now() + "." + ext;
 cb(null,name);
}
});



const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB
});

const app = express();
app.use(express.static(__dirname));
const PORT = 5000;

console.log("Trying to connect to MongoDB...");
mongoose.connect("mongodb+srv://sumitlodhi8650_db_user:Sumit123@shayari-cluster.x6irjf5.mongodb.net/shayariDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("DB Error:", err));

app.use(cors());
app.use("/upload", express.static(__dirname + "/upload"));
app.use(express.json());

app.post("/add-shayari", upload.single("file"), async (req, res) => {

try {

const { text, category } = req.body;

let image = "";
let video = "";

if (req.file) {

if (req.file.mimetype.startsWith("image")) {
image = req.file.filename;
}

if (req.file.mimetype.startsWith("video")) {
video = req.file.filename;
}

}

const newShayari = new Shayari({
text,
category,
image,
video
});

await newShayari.save();

res.json({ message: "Shayari Added Successfully" });

} catch (err) {

console.log(err);
res.status(500).json({ message: "Server Error" });

}

});



// GET all shayari
// GET all shayari
app.get("/api/shayari", async (req, res) => {
  try {

    const category = req.query.category;

    let shayari;

    if (category) {
      shayari = await Shayari.find({ category: category });
    } else {
      shayari = await Shayari.find({});
    }

    res.json(shayari);

  } catch (err) {

    console.error("Fetch error:", err);

    res.status(500).json({ error: "Failed to fetch shayari" });

  }
});

app.get("/trending", async (req,res)=>{

const limit = parseInt(req.query.limit) || 5;
const skip = parseInt(req.query.skip) || 0;

try{

const shayari = await Shayari
.find()
.sort({likes:-1})
.skip(skip)
.limit(limit);

res.json(shayari);

}catch(err){

res.status(500).json({error:"failed to fetch trending"});

}

});

app.get("/category/:name", async (req,res)=>{

const shayari = await Shayari.find({
category:req.params.name
}).sort({createdAt:-1});

res.json(shayari);

});

// ADD NEW SHAYARI
app.post("/api/shayari", verifyToken, upload.single("file"), async (req,res)=>{
  try {
    const newShayari = new Shayari({
text:req.body.text,
category:req.body.category,
image:req.file ? req.file.filename : "",
likes:0
});

    await newShayari.save();
    res.json({ message: "Shayari Added Successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add shayari" });
  }
});


// LIKE route
app.post("/api/shayari/like/:id", async (req,res)=>{

try{

const user=req.headers["user-id"] || "guest";

const shayari=await Shayari.findById(req.params.id);

if(!shayari){
return res.status(404).json({message:"Shayari not found"});
}

if(shayari.likedBy.includes(user)){
return res.json({message:"Already liked"});
}

shayari.likes+=1;

shayari.likedBy.push(user);

await shayari.save();

res.json({likes:shayari.likes});

}catch(err){

res.status(500).json({error:"Like failed"});

}

});

app.post("/api/shayari/comment/:id", async (req,res)=>{

try{

const {user,text}=req.body;

const shayari=await Shayari.findById(req.params.id);

if(!shayari){
return res.status(404).json({message:"Shayari not found"});
}

shayari.comments.push({user,text});

await shayari.save();

res.json({comments:shayari.comments});

}catch(err){

res.status(500).json({error:"Comment failed"});

}

});

// DELETE SHAYARI
app.delete("/api/shayari/:id", verifyToken, async (req, res) => {
  try {
    await Shayari.findByIdAndDelete(req.params.id);
    res.json({ message: "Shayari Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete shayari" });
  }
});

// EDIT SHAYARI
app.put("/api/shayari/:id", verifyToken, async (req, res) => {
  try {
    const updatedShayari = await Shayari.findByIdAndUpdate(
      req.params.id,           // kaunsi shayari
      { text: req.body.text }, // kya change karna hai
      { new: true }            // updated version wapas bhejna
    );

    res.json(updatedShayari);
  } catch (err) {
    res.status(500).json({ error: "Failed to update shayari" });
  }
});






// Root test
app.get("/", (req, res) => {
 res.sendFile(__dirname + "/../index.html");
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid Email" });
  }

  const passwordIsValid = bcrypt.compareSync(
    password,
    ADMIN_PASSWORD_HASH
  );

  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  const token = jwt.sign({ role: "admin" }, SECRET_KEY, {
    expiresIn: "2h"
  });

  res.json({ token });
});

app.get("/api/shayari/:id", async (req,res)=>{

try{

const shayari = await Shayari.findById(req.params.id);

if(!shayari){
return res.status(404).json({message:"Not found"});
}

res.json(shayari);

}catch(err){
res.status(500).json({error:"Server error"});
}

});

// view count API
app.post("/api/shayari/view/:id", async(req,res)=>{

const id=req.params.id;

const shayari=await Shayari.findByIdAndUpdate(
id,
{$inc:{views:1}},
{new:true}
);

res.json(shayari);

});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

