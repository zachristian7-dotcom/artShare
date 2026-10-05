import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { collection, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const protectedPages = ["index.html", "explore.html", "create.html", "profile.html", "post.html", ""];
const current = location.pathname.split("/").pop();

onAuthStateChanged(auth, async user => {
  if (!user && protectedPages.includes(current)) {
    location.href = "login.html"; return;
  }
  if (user) {
    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
      await signOut(auth); location.href = "login.html";
    });
    await loadPage(user);
  }
});

function esc(value="") {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function postCard(post) {
  return `<article class="post-card">
    <a href="post.html?id=${post.id}"><img class="post-image" src="${esc(post.imageUrl)}" alt="${esc(post.title)}"></a>
    <div class="post-body">
      <h3 class="post-title">${esc(post.title)}</h3>
      <div class="post-meta"><span>@${esc(post.username || "artist")}</span><span>♥ ${post.likes || 0}</span></div>
      ${post.description ? `<p class="post-desc">${esc(post.description).slice(0,140)}</p>` : ""}
      <div class="actions"><button class="icon-button" data-like="${post.id}">♥ Like</button><a class="icon-button" href="post.html?id=${post.id}">View</a></div>
    </div>
  </article>`;
}

async function loadPosts(container, options={}) {
  container.innerHTML = `<div class="empty">Loading artwork...</div>`;
  try {
    let q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(options.limit || 30));
    if (options.uid) q = query(collection(db, "posts"), where("uid","==",options.uid), orderBy("createdAt","desc"), limit(30));
    const snap = await getDocs(q);
    const posts = snap.docs.map(d => ({id:d.id,...d.data()}));
    container.innerHTML = posts.length ? posts.map(postCard).join("") : `<div class="empty">No artwork yet. Be the first to post.</div>`;
  } catch(err) {
    console.error(err); container.innerHTML = `<div class="empty">Could not load the feed. Check your Firebase setup and Firestore rules.</div>`;
  }
}

async function loadPage(user) {
  const feed = document.getElementById("feed");
  if (feed) await loadPosts(feed);

  const profile = document.getElementById("profile");
  if (profile) {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js");
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.exists() ? snap.data() : {displayName:user.displayName || "Artist", username:"artist", bio:""};
    profile.innerHTML = `<img class="avatar" src="${esc(data.avatarUrl || 'assets/avatar-placeholder.svg')}" alt="">
      <div><h1>${esc(data.displayName)}</h1><p>@${esc(data.username)}</p><p>${esc(data.bio || "No bio yet.")}</p></div>`;
    await loadPosts(feed, {uid:user.uid});
  }
}
