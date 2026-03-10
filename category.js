const params = new URLSearchParams(window.location.search);
const categoryName = params.get("name");

const categoryInfo = {

love:{
emoji:"❤️",
bg:"linear-gradient(135deg,#ff9a9e,#fad0c4)",
desc:"Beautiful love shayari collection"
},

sad:{
emoji:"💔",
bg:"linear-gradient(135deg,#a18cd1,#fbc2eb)",
desc:"Heart touching sad shayari"
},

motivation:{
emoji:"🔥",
bg:"linear-gradient(135deg,#f6d365,#fda085)",
desc:"Motivational shayari for life"
},

friendship:{
emoji:"🤝",
bg:"linear-gradient(135deg,#84fab0,#8fd3f4)",
desc:"Friendship shayari collection"
},

life:{
emoji:"🌿",
bg:"linear-gradient(135deg,#cfd9df,#e2ebf0)",
desc:"Life thoughts and shayari"
}

};


const info = categoryInfo[categoryName];

document.body.style.background = info.bg;

document.getElementById("categoryTitle").innerText =
info.emoji + " " + categoryName + " Shayari";

document.getElementById("categorySub").innerText =
info.desc;
document.getElementById("categoryTitle").innerText = categoryName + " Shayari";

const emojiMap = {
love: "❤️",
sad: "💔",
motivation: "🔥",
friendship: "🤝",
life: "🌿"
};

const emoji = emojiMap[categoryName] || "✨";






const container = document.getElementById("shayari-container");

fetch("http://localhost:5000/api/shayari?category=" + categoryName)
.then(res => res.json())
.then(data => {



data.reverse().forEach((item,index)=>{
    addView(item._id);
const rank = data.length - index;
const wrapper = document.createElement("div");
wrapper.className = "shayari-container";

const card = document.createElement("div");
card.className = "shayari-card";


card.innerHTML = `
<div class="shayari-rank">${rank}</div>
<div class="shayari-tag">${emoji} ${categoryName}</div>

${item.image && item.image.endsWith(".mp4") ? `
<video class="shayariVideo" autoplay muted loop playsinline width="100%" onclick="toggleMute(this)">
<source src="http://localhost:5000/upload/videos/${item.image}" type="video/mp4">
</video>
` : item.image ? `
<img src="http://localhost:5000/upload/images/${item.image}" width="100%">
` : `
<div class="text-only-card">
${item.text}
</div>
`}



<div class="shayari-text">
${item.text}
</div>
<div class="view-count">
👁 ${item.views || 0} views
</div>

<div class="double-heart">❤️</div>

<div class="shayari-actions">
<button class="like-btn" onclick="likeShayari('${item._id}', this)">
❤️ <span>${item.likes || 0}</span>
</button>

<button onclick="openComment('${item._id}')">
💬 <span>${item.comments ? item.comments.length : 0}</span>
</button>

<button onclick="shareShayari('${item.text}')">🔗 Share</button>
<button onclick="downloadStatus('${item.image}')">⬇ Download</button>
</div>

<div class="shayari-time">
${formatTime(item.createdAt)}
</div>
`;
wrapper.appendChild(card);
container.appendChild(wrapper);
card.ondblclick = () => {

const btn = card.querySelector(".like-btn")

likeShayari(item._id, btn)

}

});

});

function likeShayari(id,btn){

const userId=localStorage.getItem("userId") || Date.now()

localStorage.setItem("userId",userId)

fetch(`http://127.0.0.1:5000/api/shayari/like/${id}`,{

method:"POST",

headers:{
"user-id":userId
}

})
.then(res=>res.json())
.then(data=>{

if(data.message){

showPopup("❤️ Already liked")

return
}

btn.querySelector("span").innerText=data.likes

const card=btn.closest(".shayari-card")

card.classList.add("liked")

setTimeout(()=>{
card.classList.remove("liked")
},800)

showPopup("❤️ Liked")

})

}

function showPopup(message){

const popup = document.getElementById("popup")

popup.innerText = message

popup.classList.add("show")

setTimeout(()=>{
popup.classList.remove("show")
},2000)

}

let currentShayari=null;

function openComment(id){

currentShayari=id;

document.getElementById("commentPanel").classList.add("show");

loadComments(id);

}
function sendComment(){

const user=document.getElementById("commentUser").value;
const text=document.getElementById("commentInput").value;

fetch(`http://127.0.0.1:5000/api/shayari/comment/${currentShayari}`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({user,text})
})
.then(res=>res.json())
.then(data=>{

showPopup("💬 Comment added");
loadComments(currentShayari);
const commentBtn = document.querySelector(`button[onclick="openComment('${currentShayari}')"] span`);

if(commentBtn){
commentBtn.innerText = data.comments.length;
}

document.getElementById("commentInput").value="";

document.getElementById("commentBox").style.display="none";

});

}

function toggleMute(video){

video.muted = !video.muted;

}





const videos = document.querySelectorAll(".shayariVideo");
setTimeout(initVideoObserver,500);
function initVideoObserver(){

const videos=document.querySelectorAll(".shayariVideo");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

const video=entry.target;

if(entry.isIntersecting){

video.play().catch(()=>{});

}else{

video.pause();
video.currentTime=0;

}

});

},{threshold:0.6});

videos.forEach(v=>{
observer.observe(v);
});

}

const observer = new IntersectionObserver((entries) => {

entries.forEach(entry => {

const video = entry.target;

if(entry.isIntersecting){

video.play().catch(()=>{});

}else{

video.pause();
video.currentTime = 0;

}

});

},{threshold:0.5});

videos.forEach(video=>{
observer.observe(video);
});

function downloadStatus(file){

let url = "";

if(file.endsWith(".mp4")){
url = "http://localhost:5000/upload/videos/" + file;
}else{
url = "http://localhost:5000/upload/images/" + file;
}

const a = document.createElement("a");
a.href = url;
a.download = "shayari-status";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);

}

function shareShayari(text){

if(navigator.share){

navigator.share({
title:"Dil Se Shayari",
text:text + "\n\nRead more on DilSeShayari.com",
url:window.location.href
});

}else{

navigator.clipboard.writeText(text);
alert("Shayari copied!");

}

}

document.addEventListener("click", function(e){

const box = document.getElementById("commentBox");

if(!box) return;

if(
box.style.display === "block" &&
!box.contains(e.target) &&
!e.target.closest("button")
){
box.style.display = "none";
}

});

function loadComments(id){

fetch(`http://127.0.0.1:5000/api/shayari/${id}`)
.then(res=>res.json())
.then(data=>{

const list=document.getElementById("commentList");

list.innerHTML="";

data.comments.forEach(c=>{

const div=document.createElement("div");

div.innerHTML=`<b>${c.user}</b>: ${c.text}`;

list.appendChild(div);

});

});

}

function closeComments(){

document.getElementById("commentPanel").classList.remove("show");

}

function loadComments(id){

fetch(`http://127.0.0.1:5000/api/shayari/${id}`)
.then(res=>res.json())
.then(data=>{

const list=document.getElementById("commentList");

list.innerHTML="";

if(!data.comments || data.comments.length===0){

list.innerHTML="<p style='text-align:center;color:gray'>No comments yet</p>";
return;

}

data.comments.forEach(c=>{

const div=document.createElement("div");

div.className="comment-item";

div.innerHTML=`
<div class="comment-avatar">
${c.user.charAt(0).toUpperCase()}
</div>

<div class="comment-content">
<div class="comment-user">${c.user}</div>
<div class="comment-text">${c.text}</div>
</div>
`;

list.appendChild(div);

});

});

}

function formatTime(date){

const seconds = Math.floor((new Date() - new Date(date)) / 1000);

const minutes = Math.floor(seconds / 60);
const hours = Math.floor(seconds / 3600);
const days = Math.floor(seconds / 86400);

if(seconds < 60) return "Just now";

if(minutes < 60) return minutes + " min ago";

if(hours < 24) return hours + " hr ago";

return days + " days ago";

}

function addView(id){

fetch(`http://127.0.0.1:5000/api/shayari/view/${id}`,{
method:"POST"
})

}