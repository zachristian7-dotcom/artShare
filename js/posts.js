import {auth,db} from "./firebase.js";
import {uploadImage} from "./cloudinary.js";
import {addDoc,collection,serverTimestamp} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import {getPosts,getPost} from "./firestore-data.js";

const form=document.querySelector("#postForm"),status=document.querySelector("#status"),image=document.querySelector("#image"),preview=document.querySelector("#preview"),wrap=document.querySelector("#previewWrap");
const show=m=>{if(status)status.textContent=m};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

image?.addEventListener("change",()=>{const f=image.files?.[0];if(f){preview.src=URL.createObjectURL(f);wrap.classList.remove("hidden")}});

form?.addEventListener("submit",async e=>{
 e.preventDefault();
 if(!auth.currentUser){location.href="./login.html";return}
 const f=image.files?.[0];if(!f)return show("Choose an image first.");
 try{
  form.querySelector("button").disabled=true;show("Uploading artwork…");
  const u=await uploadImage(f);show("Publishing post…");
  await addDoc(collection(db,"posts"),{
   uid:auth.currentUser.uid,username:auth.currentUser.displayName||"Artist",
   title:form.title.value.trim(),description:form.description.value.trim(),
   tags:form.tags.value.split(",").map(x=>x.trim().toLowerCase()).filter(Boolean).slice(0,20),
   imageUrl:u.url,cloudinaryPublicId:u.publicId,width:u.width,height:u.height,format:u.format,bytes:u.bytes,
   likes:0,createdAt:serverTimestamp()
  });
  location.href="./explore.html";
 }catch(x){console.error(x);show(x.message||"Could not publish the post.");form.querySelector("button").disabled=false}
});

async function feed(){
 const el=document.querySelector("#feed");if(!el)return;
 try{
  const posts=await getPosts(30);el.innerHTML="";
  if(!posts.length){el.innerHTML='<div class="empty">No posts yet. Be the first to publish something!</div>';return}
  posts.forEach(p=>{
   const a=document.createElement("article");a.className="post-card";
   a.innerHTML=`<a class="post-image" href="./post.html?id=${encodeURIComponent(p.id)}"><img src="${esc(p.imageUrl)}" alt="${esc(p.title||"Artwork")}" loading="lazy"></a>
   <div class="post-body"><h3 class="post-title">${esc(p.title||"Untitled")}</h3><div class="post-author">by ${esc(p.username||"Artist")}</div>
   ${(p.tags||[]).slice(0,5).length?`<div class="tags">${(p.tags||[]).slice(0,5).map(t=>`<span class="tag">#${esc(t)}</span>`).join("")}</div>`:""}</div>`;
   el.appendChild(a);
  });
 }catch(x){console.error(x);show(`Could not load the feed: ${x.message||"Firestore error"}`)}
}

async function single(){
 const el=document.querySelector("#post");if(!el)return;
 const id=new URLSearchParams(location.search).get("id");if(!id)return;
 try{
  const p=await getPost(id);
  if(!p){el.innerHTML='<div class="card"><p>Post not found.</p></div>';return}
  el.innerHTML=`<div class="detail-image"><img src="${esc(p.imageUrl)}" alt="${esc(p.title||"Artwork")}"></div>
  <section class="card detail-panel"><p class="eyebrow">ARTWORK</p><h1>${esc(p.title||"Untitled")}</h1>
  <div class="author-row"><div class="avatar">${esc((p.username||"A")[0].toUpperCase())}</div><div><strong>${esc(p.username||"Artist")}</strong><div class="muted">Artist</div></div></div>
  <p>${esc(p.description||"")}</p>${(p.tags||[]).length?`<div class="tags">${p.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join("")}</div>`:""}
  </section>`;
 }catch(x){console.error(x);el.innerHTML=`<div class="card"><p>${esc(x.message||"Firestore error")}</p></div>`}
}
if(document.querySelector("#feed"))feed();
if(document.querySelector("#post"))single();
