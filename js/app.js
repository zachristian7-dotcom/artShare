import{auth}from"./firebase.js";
import{onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import{getUserPosts}from"./firestore-data.js";

export function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
export function toast(m){document.querySelector(".toast")?.remove();const e=document.createElement("div");e.className="toast";e.textContent=m;document.body.append(e);setTimeout(()=>e.remove(),2500)}

onAuthStateChanged(auth,u=>{
 const a=document.querySelector("#authLink"),area=document.querySelector("#userArea");
 if(a){a.textContent=u?"Log out":"Log in";a.href=u?"#":"./login.html";if(u)a.onclick=async e=>{e.preventDefault();await signOut(auth);location.reload()}}
 if(area)area.innerHTML=u?`<a class="avatar" href="./profile.html" aria-label="Your profile">${esc((u.displayName||"A")[0].toUpperCase())}</a>`:`<a class="btn primary" href="./login.html">Log in</a>`;
});

const name=document.querySelector("#profileName"),feed=document.querySelector("#profileFeed"),bio=document.querySelector("#profileBio");
if(name&&feed)onAuthStateChanged(auth,async u=>{
 if(!u){name.textContent="Not logged in";bio.textContent="Log in to view your profile.";return}
 name.textContent=u.displayName||"Artist";
 const avatar=document.querySelector("#profileAvatar");if(avatar)avatar.textContent=(u.displayName||"A")[0].toUpperCase();
 try{
  const posts=await getUserPosts(u.uid);
  feed.innerHTML=posts.length?posts.map(p=>`<article class="post-card"><a class="post-image" href="./post.html?id=${encodeURIComponent(p.id)}"><img src="${esc(p.imageUrl)}" alt="${esc(p.title||"Artwork")}" loading="lazy"></a><div class="post-body"><h3 class="post-title">${esc(p.title||"Untitled")}</h3><div class="post-author">${esc(p.username||"Artist")}</div></div></article>`).join(""):`<div class="empty">You haven't posted anything yet.<br><a class="btn primary" href="./create.html" style="margin-top:12px">Create your first post</a></div>`;
 }catch(e){console.error(e);bio.textContent="Could not load your posts: "+(e.message||"")}
});
