import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getUserPosts } from "./firestore-data.js";

onAuthStateChanged(auth, u => {
  const a = document.querySelector("#authLink");
  if (a) {
    a.textContent = u ? "Log out" : "Log in";
    a.href = u ? "#" : "./login.html";
    if (u) a.onclick = async e => { e.preventDefault(); await signOut(auth); location.reload(); };
  }
});

const name = document.querySelector("#profileName");
const feed = document.querySelector("#profileFeed");
const bio = document.querySelector("#profileBio");

if (name && feed) onAuthStateChanged(auth, async u => {
  if (!u) {
    name.textContent = "Not logged in";
    bio.textContent = "Log in to view your profile.";
    return;
  }

  name.textContent = u.displayName || "Artist";

  try {
    const posts = await getUserPosts(u.uid, 30);
    feed.innerHTML = "";

    posts.forEach(p => {
      const a = document.createElement("article");
      a.className = "post-card";
      a.innerHTML = `<a href="./post.html?id=${encodeURIComponent(p.id)}"><img src="${safe(p.imageUrl)}" alt="${safe(p.title || "Artwork")}"></a><div class="body"><h3>${safe(p.title || "Untitled")}</h3></div>`;
      feed.appendChild(a);
    });

    if (!posts.length) bio.textContent = "You haven't posted anything yet.";
  } catch (x) {
    console.error("Profile posts error:", x);
    bio.textContent = `Could not load your posts: ${x.message || "Firestore error"}`;
  }
});

function safe(v = "") {
  return String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
