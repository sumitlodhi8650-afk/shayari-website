// alert("JS WORKING");
function renderLeaderboard(data) {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";

    const topFive = [...data]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    topFive.forEach((item, index) => {
        const topItem = document.createElement("p");
        topItem.innerText = `${index + 1}. ❤️ ${item.likes} - ${item.text}`;
        leaderboard.appendChild(topItem);
    });
}

const container = document.getElementById("shayari-container");

// Backend se data fetch karo
fetch("http://127.0.0.1:5000/api/shayari")
  .then(res => res.json())
  .then(data => {
    renderLeaderboard(data);
   

    data.forEach(item => {
      

      const card = document.createElement("div");
      card.className = "shayari-card";

      const text = document.createElement("p");
      text.innerText = item.text;

      const likeBtn = document.createElement("button");
      likeBtn.innerHTML = `❤️ <span id="like-${item._id}">${item.likes}</span>`;

      likeBtn.onclick = () => {
        const likedKey = `liked_${item._id}`;

if (localStorage.getItem(likedKey)) {
    alert("Tum already like kar chuke ho ❤️");
    return;
}
        fetch(`http://127.0.0.1:5000/api/shayari/${item._id}/like`, {
          method: "POST"
        })
        .then(res => res.json())
        .then(updated => {
          
          const likeCount = document.getElementById(`like-${item._id}`);
          likeCount.innerText = updated.likes;
          localStorage.setItem(likedKey, "true");
likeBtn.disabled = true;
fetch("http://127.0.0.1:5000/api/shayari")
  .then(res => res.json())
  .then(data => {
    renderLeaderboard(data);
  });

// Animation
       likeCount.classList.add("pop");
setTimeout(() => {
    likeCount.classList.remove("pop");
}, 300);
        });
      };

      card.appendChild(text);
      card.appendChild(likeBtn);
      container.appendChild(card);

    });

  })
  .catch(err => console.log("Error:", err));

  const text = "Zoya Kashyap";
let i = 0;

function typeWriter() {

if (i < text.length) {

document.getElementById("title").innerHTML += text.charAt(i);

i++;

setTimeout(typeWriter, 120);

}

}

typeWriter();

const intro = document.getElementById("intro");

intro.addEventListener("click", function () {

intro.style.transition = "1s";
intro.style.transform = "scale(1.4)";
intro.style.opacity = "0";

setTimeout(function () {

intro.style.display = "none";
document.getElementById("mainSite").style.display = "block";

}, 1000);

});

function toggleMenu(){

const menu = document.getElementById("dropdownMenu")
const overlay = document.getElementById("menuOverlay")

if(menu.style.display === "flex"){

menu.style.display="none"
overlay.style.display="none"

}else{

menu.style.display="flex"
overlay.style.display="block"

}

}

async function loadTrending(){

const res = await fetch("http://localhost:5000/trending");

const data = await res.json();

const container = document.getElementById("trendingContainer");

container.innerHTML="";

data.forEach(s=>{

container.innerHTML += `
<div class="shayariCard">

<p>${s.text}</p>

<div class="actions">

<span>❤️ ${s.likes}</span>

</div>

</div>
`;

});

}



async function openCategory(category){

const res = await fetch(`/category/${category}`);

const data = await res.json();

const container = document.getElementById("shayari-container");

container.innerHTML="";

data.forEach(s=>{

container.innerHTML += `
<div class="shayariCard">

<p>${s.text}</p>

<div class="actions">

<span>❤️ ${s.likes}</span>

</div>

</div>
`;

});

}

function openCategoryPage(category){

window.location.href = "category.html?name=" + category;

}

function shareShayari(text){

if(navigator.share){

navigator.share({
title:"Shayari",
text:text,
url:window.location.href
});

}

}

document.getElementById("menuOverlay").onclick=function(){

document.getElementById("dropdownMenu").style.display="none"
this.style.display="none"

}

function scrollToTrending(){

document.getElementById("trending").scrollIntoView({behavior:"smooth"})
closeMenu()
highlightSection("trending")

}

function scrollToCategories(){

document.getElementById("categories").scrollIntoView({behavior:"smooth"})
closeMenu()
highlightSection("categories")

}

function scrollToFooter(){

document.getElementById("footer").scrollIntoView({behavior:"smooth"})
closeMenu()
highlightSection("footer")

}

function closeMenu(){

document.getElementById("dropdownMenu").style.display="none"
document.getElementById("menuOverlay").style.display="none"

}

function highlightSection(id){

const section=document.getElementById(id)

section.classList.add("section-highlight")

setTimeout(()=>{
section.classList.remove("section-highlight")
},2000)

}









function enterSite(){

document.getElementById("intro").style.display = "none";

document.getElementById("mainSite").style.display = "block";

loadTrending()

}

let skip = 0;
const limit = 5;
let loading = false;

function loadTrending(){

if(loading) return;

loading = true;

fetch(`http://localhost:5000/trending?skip=${skip}&limit=${limit}`)
.then(res => res.json())
.then(data => {

const container = document.getElementById("trending-container");
const loadingText = document.getElementById("loading");

loadingText.style.display = "none";

data.forEach(item => {

const card = document.createElement("div");

card.className = "trending-card";

card.innerHTML = `

${item.image ? (
item.image.endsWith(".mp4") ?

`<video class="shayariVideo" autoplay muted loop playsinline>
<source src="http://localhost:5000/upload/videos/${item.image}" type="video/mp4">
</video>`

:

`<img src="http://localhost:5000/upload/images/${item.image}" class="shayari-img">`

)

:

`<div class="text-only-card">${item.text}</div>`
}

${item.image ? `<div class="shayari-text">${item.text}</div>` : ""}

<div class="shayari-actions">

<button onclick="likeShayari('${item._id}')">
❤️ ${item.likes}
</button>

<button onclick="shareShayari('${item.text}')">
🔗 Share
</button>

</div>

`;

container.appendChild(card);
const videos = card.querySelectorAll("video");

videos.forEach(video => {
  video.play().catch(()=>{});
});

});

skip += limit;

loading = false;

});
}

loadTrending();



window.addEventListener("scroll",()=>{

if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200){

loadTrending();

}

});

async function loadTrending(){

const res = await fetch("http://localhost:5000/trending?limit=5")
const data = await res.json()

const container = document.getElementById("trending-container")

if(!container) return

container.innerHTML=""

data.forEach((shayari,index)=>{

let badge=""

if(index===0) badge="gold"
else if(index===1) badge="silver"
else if(index===2) badge="bronze"

let media=""

if(shayari.video || (shayari.image && shayari.image.endsWith(".mp4"))){

media = `
<video class="shayariVideo" muted loop autoplay playsinline>
<source src="http://localhost:5000/upload/videos/${shayari.video}" type="video/mp4">
</video>
`

}

else if(shayari.image){

media=`<img src="http://localhost:5000/upload/images/${shayari.image}">`

}

else{

media=`<div class="text-shayari">${shayari.text}</div>`

}

container.innerHTML+=`

<div class="trending-card ${badge}">

${index===0?'<div class="rank">🥇</div>':''}
${index===1?'<div class="rank">🥈</div>':''}
${index===2?'<div class="rank">🥉</div>':''}

<span class="category-tag">${shayari.category}</span>

${media}

<p>${shayari.text || ""}</p>

<div class="shayari-actions">

<button>❤️ ${shayari.likes}</button>

<button>🔗 Share</button>

</div>

</div>

`

})

autoPlayVideos()

}

function autoPlayVideos(){

const videos=document.querySelectorAll(".shayariVideo")

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){
entry.target.play()
}

else{
entry.target.pause()
}

})

},{threshold:0.6})

videos.forEach(video=>{
observer.observe(video)
})

}